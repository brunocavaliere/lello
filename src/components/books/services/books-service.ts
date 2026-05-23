import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  Book,
  BookContext,
  BookInsert,
  BookReflectionEntry,
  BookStatus,
  BookUpdate,
} from '@/components/books/types';
import { BOOK_CONTEXT_BY_ID, MOCK_BOOKS } from '@/components/books/constants';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { Database } from '@/lib/supabase/types';

type BooksClient = SupabaseClient<Database>;

type GetBooksOptions = {
  status?: BookStatus;
};

function getBooksClient(client?: BooksClient) {
  return client ?? createSupabaseBrowserClient();
}

function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase nao esta configurado para persistir livros.');
  }
}

function getMockBooks(options?: GetBooksOptions) {
  const books = [...MOCK_BOOKS];

  if (!options?.status) {
    return books;
  }

  return books.filter((book) => book.status === options.status);
}

export function getBookContext(bookId: string): BookContext {
  return (
    BOOK_CONTEXT_BY_ID[bookId] ?? {
      reflections: [],
      highlights: [],
      summaries: [],
    }
  );
}

export async function getBooks(options?: GetBooksOptions, client?: BooksClient) {
  if (!isSupabaseConfigured()) {
    return getMockBooks(options);
  }

  const supabase = getBooksClient(client);
  let query = supabase.from('books').select('*').order('updated_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Nao foi possivel carregar os livros: ${error.message}`);
  }

  return data satisfies Book[];
}

export async function getBooksForStatus(status: BookStatus, client?: BooksClient) {
  return getBooks({ status }, client);
}

export async function getQueueBooks(client?: BooksClient) {
  return getBooksForStatus('want_to_read', client);
}

export async function getBookById(id: string, client?: BooksClient) {
  if (!isSupabaseConfigured()) {
    return MOCK_BOOKS.find((book) => book.id === id) ?? null;
  }

  const supabase = getBooksClient(client);
  const { data, error } = await supabase.from('books').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw new Error(`Nao foi possivel carregar o livro: ${error.message}`);
  }

  return data satisfies Book | null;
}

export async function createBook(input: BookInsert, client?: BooksClient) {
  ensureSupabaseConfigured();

  const supabase = getBooksClient(client);
  const { data, error } = await supabase
    .from('books')
    .insert({
      author: input.author,
      status: input.status,
      title: input.title,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Nao foi possivel criar o livro: ${error.message}`);
  }

  return data satisfies Book;
}

export async function updateBook(id: string, input: BookUpdate, client?: BooksClient) {
  ensureSupabaseConfigured();

  const supabase = getBooksClient(client);
  const { data, error } = await supabase
    .from('books')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Nao foi possivel atualizar o livro: ${error.message}`);
  }

  return data satisfies Book;
}

export async function deleteBook(id: string, client?: BooksClient) {
  ensureSupabaseConfigured();

  const supabase = getBooksClient(client);
  const { error } = await supabase.from('books').delete().eq('id', id);

  if (error) {
    throw new Error(`Nao foi possivel remover o livro: ${error.message}`);
  }
}

export async function getCurrentBook(client?: BooksClient) {
  const books = await getBooks({ status: 'reading' }, client);
  return books[0] ?? null;
}

export async function getRecentReflectionEntries(limit = 4, client?: BooksClient) {
  const books = await getBooks(undefined, client);

  return books
    .flatMap((book) =>
      getBookContext(book.id).reflections.map((reflection) => ({
        id: reflection.id,
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        label: reflection.label,
        content: reflection.content,
      }))
    )
    .slice(0, limit) satisfies BookReflectionEntry[];
}
