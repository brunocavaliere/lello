import type { NoteCategory, NoteType } from '@/components/notes/types';

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  text: 'Nota escrita',
  audio: 'Áudio',
};

export const NOTE_CATEGORY_LABELS: Record<NoteCategory, string> = {
  note: 'Nota',
  reflection: 'Reflexão',
  quote: 'Citação',
  summary: 'Resumo',
};

export const NOTE_CATEGORY_OPTIONS: Array<{ label: string; value: NoteCategory }> = [
  { label: 'Nota', value: 'note' },
  { label: 'Reflexão', value: 'reflection' },
  { label: 'Citação', value: 'quote' },
  { label: 'Resumo', value: 'summary' },
];

export const NOTE_EDITOR_PLACEHOLDER = 'O que você quer anotar?';
export const UNTITLED_NOTE_LABEL = 'Nota sem título';
export const NOTES_AUDIO_BUCKET = 'notes-audio';
