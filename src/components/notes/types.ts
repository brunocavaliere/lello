import type {
  NoteCategory as PersistedNoteCategory,
  Note as PersistedNote,
  NoteInsert as PersistedNoteInsert,
  NoteType as PersistedNoteType,
  NoteUpdate as PersistedNoteUpdate,
} from '@/lib/supabase/types';

export type Note = PersistedNote;
export type NoteInsert = PersistedNoteInsert;
export type NoteUpdate = PersistedNoteUpdate;
export type NoteType = PersistedNoteType;
export type NoteCategory = PersistedNoteCategory;

export type TextNoteInput = {
  bookId: string;
  title: string;
  category: NoteCategory;
  contentHtml: string;
  contentText: string;
};

export type AudioNoteInput = {
  bookId: string;
  title?: string;
  category: NoteCategory;
  audioFile: File;
  audioDurationSeconds: number;
};

export type UpdateTextNoteInput = {
  id: string;
  title: string;
  category: NoteCategory;
  contentHtml: string;
  contentText: string;
};
