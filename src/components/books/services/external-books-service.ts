import type { ExternalBook } from '@/components/books/types';

type SearchExternalBooksResponse = {
  books: ExternalBook[];
};

export async function searchExternalBooks(query: string) {
  const params = new URLSearchParams({
    q: query.trim(),
  });

  const response = await fetch(`/api/books/search?${params.toString()}`);

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? 'Não foi possível buscar livros agora.');
  }

  const payload = (await response.json()) as SearchExternalBooksResponse;
  return payload.books;
}
