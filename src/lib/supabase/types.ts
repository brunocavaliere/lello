export type BookStatus = 'want_to_read' | 'reading' | 'completed';
export type NoteType = 'text' | 'audio';
export type NoteCategory = 'note' | 'reflection' | 'quote' | 'summary';

export type Book = {
  id: string;
  user_id: string;
  title: string;
  author: string;
  status: BookStatus;
  description?: string | null;
  cover_url?: string | null;
  publisher?: string | null;
  published_at?: string | null;
  rating?: number | null;
  created_at: string;
  updated_at: string;
};

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

export type Note = {
  id: string;
  book_id: string;
  user_id: string;
  type: NoteType;
  category: NoteCategory;
  title: string | null;
  content_html: string | null;
  content_text: string | null;
  audio_url: string | null;
  audio_duration_seconds: number | null;
  created_at: string;
  updated_at: string;
};

export type NoteInsert = {
  book_id: string;
  type?: NoteType;
  category?: NoteCategory;
  title?: string | null;
  content_html?: string | null;
  content_text?: string | null;
  audio_url?: string | null;
  audio_duration_seconds?: number | null;
};

export type NoteUpdate = Partial<
  Pick<
    NoteInsert,
    | 'title'
    | 'content_html'
    | 'content_text'
    | 'type'
    | 'audio_url'
    | 'audio_duration_seconds'
    | 'category'
  >
>;

export type Database = {
  public: {
    Tables: {
      books: {
        Row: Book;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          author: string;
          status: BookStatus;
          description?: string | null;
          cover_url?: string | null;
          publisher?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          author?: string;
          status?: BookStatus;
          description?: string | null;
          cover_url?: string | null;
          publisher?: string | null;
          published_at?: string | null;
          rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: Note;
        Insert: {
          id?: string;
          book_id: string;
          user_id: string;
          type?: NoteType;
          category?: NoteCategory;
          title?: string | null;
          content_html?: string | null;
          content_text?: string | null;
          audio_url?: string | null;
          audio_duration_seconds?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          user_id?: string;
          type?: NoteType;
          category?: NoteCategory;
          title?: string | null;
          content_html?: string | null;
          content_text?: string | null;
          audio_url?: string | null;
          audio_duration_seconds?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
