import {
  NOTE_CATEGORY_LABELS,
  NOTE_TYPE_LABELS,
  UNTITLED_NOTE_LABEL,
} from '@/components/notes/constants';
import type { Note, NoteCategory, NoteType } from '@/components/notes/types';

export function getNoteTypeLabel(type: NoteType) {
  return NOTE_TYPE_LABELS[type];
}

export function getNoteCategoryLabel(category: NoteCategory | null | undefined) {
  if (!category) {
    return NOTE_CATEGORY_LABELS.note;
  }

  return NOTE_CATEGORY_LABELS[category] ?? NOTE_CATEGORY_LABELS.note;
}

export function getNoteTitle(title: string | null, _contentText: string | null) {
  void _contentText;
  const cleanTitle = (title ?? '').trim();

  if (cleanTitle) {
    return cleanTitle;
  }

  return UNTITLED_NOTE_LABEL;
}

export function extractTextFromHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getNotePreview(contentText: string | null, maxLength = 140) {
  const text = (contentText ?? '').trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}…`;
}

export function formatNoteDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatAudioDuration(durationSeconds: number | null) {
  if (!durationSeconds || durationSeconds <= 0) {
    return '0:00';
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function matchesNoteSearch(note: Note, search: string) {
  const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');

  if (!normalizedSearch) {
    return true;
  }

  const fields = [note.title ?? '', note.content_text ?? '', getNoteCategoryLabel(note.category)];

  return fields.some((field) =>
    String(field ?? '')
      .toLocaleLowerCase('pt-BR')
      .includes(normalizedSearch)
  );
}
