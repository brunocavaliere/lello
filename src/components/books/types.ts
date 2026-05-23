import type {
  Book as PersistedBook,
  BookStatus as PersistedBookStatus,
} from '@/lib/supabase/types';

export type Book = PersistedBook;
export type BookStatus = PersistedBookStatus;
export type BookInsert = {
  title: string;
  author: string;
  status: BookStatus;
  description?: string | null;
  cover_url?: string | null;
  publisher?: string | null;
  published_at?: string | null;
};

export type BookUpdate = Partial<BookInsert> & {
  rating?: number | null;
};

export type ExternalBook = {
  external_id: string;
  title: string;
  author: string;
  description?: string | null;
  cover_url?: string | null;
  publisher?: string | null;
  published_at?: string | null;
  page_count?: number | null;
  categories?: string[];
};

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
