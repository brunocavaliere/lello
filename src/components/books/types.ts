import type {
  Book as PersistedBook,
  BookInsert as PersistedBookInsert,
  BookStatus as PersistedBookStatus,
  BookUpdate as PersistedBookUpdate,
} from '@/lib/supabase/types';

export type Book = PersistedBook;
export type BookInsert = PersistedBookInsert;
export type BookStatus = PersistedBookStatus;
export type BookUpdate = PersistedBookUpdate;

export type BookStatusMeta = {
  label: string;
  badgeVariant: 'default' | 'secondary' | 'outline';
};

export type BookReflection = {
  id: string;
  label: string;
  content: string;
  createdAt?: string;
};

export type BookHighlight = {
  id: string;
  label: string;
  excerpt: string;
  note?: string;
  createdAt?: string;
};

export type BookSummary = {
  id: string;
  label: string;
  content: string;
  createdAt?: string;
};

export type BookNoteType = 'note' | 'reflection' | 'highlight' | 'summary';

export type BookNote = {
  id: string;
  type: BookNoteType;
  label: string;
  content: string;
  support?: string;
  createdAt?: string;
};

export type BookContext = {
  overview?: string;
  currentChapter?: string;
  resumeNote?: string;
  reflections: BookReflection[];
  highlights: BookHighlight[];
  summaries: BookSummary[];
};

export type BookWorkspace = {
  book: Book;
  context: BookContext;
};

export type ReadingStat = {
  label: string;
  value: string;
  description: string;
};

export type BookReflectionEntry = {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  label: string;
  content: string;
};
