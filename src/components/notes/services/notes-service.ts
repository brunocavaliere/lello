import type { SupabaseClient } from '@supabase/supabase-js';

import { NOTES_AUDIO_BUCKET, UNTITLED_NOTE_LABEL } from '@/components/notes/constants';
import type {
  AudioNoteInput,
  Note,
  TextNoteInput,
  UpdateTextNoteInput,
} from '@/components/notes/types';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { Database } from '@/lib/supabase/types';

type NotesClient = SupabaseClient<Database>;

function getNotesClient(client?: NotesClient) {
  return client ?? createSupabaseBrowserClient();
}

function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase nao esta configurado para persistir notas.');
  }
}

function buildAudioStoragePath(bookId: string, audioFile: File) {
  const extension =
    audioFile.name.split('.').pop()?.toLowerCase() || getAudioExtension(audioFile.type);

  return `${bookId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
}

function getAudioExtension(mimeType: string) {
  if (mimeType.includes('mp4')) {
    return 'm4a';
  }

  if (mimeType.includes('mpeg')) {
    return 'mp3';
  }

  if (mimeType.includes('wav')) {
    return 'wav';
  }

  if (mimeType.includes('aac')) {
    return 'aac';
  }

  return 'webm';
}

function getAudioStoragePathFromUrl(audioUrl: string) {
  try {
    const { pathname } = new URL(audioUrl);
    const marker = `/${NOTES_AUDIO_BUCKET}/`;
    const markerIndex = pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

export async function getNotesByBookId(bookId: string, client?: NotesClient) {
  if (!isSupabaseConfigured()) {
    return [] as Note[];
  }

  const supabase = getNotesClient(client);
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('book_id', bookId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Nao foi possivel carregar as notas: ${error.message}`);
  }

  return data satisfies Note[];
}

export async function createTextNote(input: TextNoteInput, client?: NotesClient) {
  ensureSupabaseConfigured();

  const supabase = getNotesClient(client);
  const { data, error } = await supabase
    .from('notes')
    .insert({
      book_id: input.bookId,
      type: 'text',
      category: input.category,
      title: input.title,
      content_html: input.contentHtml,
      content_text: input.contentText,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Nao foi possivel salvar a nota: ${error.message}`);
  }

  return data satisfies Note;
}

export async function createAudioNote(input: AudioNoteInput, client?: NotesClient) {
  ensureSupabaseConfigured();

  const supabase = getNotesClient(client);
  const audioPath = buildAudioStoragePath(input.bookId, input.audioFile);
  const { error: uploadError } = await supabase.storage
    .from(NOTES_AUDIO_BUCKET)
    .upload(audioPath, input.audioFile, {
      cacheControl: '3600',
      contentType: input.audioFile.type || 'audio/webm',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Nao foi possivel enviar o audio: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from(NOTES_AUDIO_BUCKET).getPublicUrl(audioPath);
  const normalizedTitle = input.title?.trim() || UNTITLED_NOTE_LABEL;

  const { data, error } = await supabase
    .from('notes')
    .insert({
      book_id: input.bookId,
      type: 'audio',
      category: input.category,
      title: normalizedTitle,
      content_html: null,
      content_text: null,
      audio_url: publicUrlData.publicUrl,
      audio_duration_seconds: input.audioDurationSeconds,
    })
    .select('*')
    .single();

  if (error) {
    await supabase.storage.from(NOTES_AUDIO_BUCKET).remove([audioPath]);
    throw new Error(`Nao foi possivel salvar a nota de audio: ${error.message}`);
  }

  return data satisfies Note;
}

export async function updateTextNote(input: UpdateTextNoteInput, client?: NotesClient) {
  ensureSupabaseConfigured();

  const supabase = getNotesClient(client);
  const { data, error } = await supabase
    .from('notes')
    .update({
      category: input.category,
      title: input.title,
      content_html: input.contentHtml,
      content_text: input.contentText,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Nao foi possivel atualizar a nota: ${error.message}`);
  }

  return data satisfies Note;
}

export async function deleteNote(note: Note, client?: NotesClient) {
  ensureSupabaseConfigured();

  const supabase = getNotesClient(client);
  const { error } = await supabase.from('notes').delete().eq('id', note.id);

  if (error) {
    throw new Error(`Nao foi possivel excluir a nota: ${error.message}`);
  }

  if (note.type === 'audio' && note.audio_url) {
    const audioPath = getAudioStoragePathFromUrl(note.audio_url);

    if (audioPath) {
      await supabase.storage.from(NOTES_AUDIO_BUCKET).remove([audioPath]);
    }
  }
}
