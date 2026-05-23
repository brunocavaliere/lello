import type { NextRequest } from 'next/server';

import { env } from '@/env';
import type { ExternalBook } from '@/components/books/types';

type GoogleBooksVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    publisher?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
};

function normalizeGoogleBooksQuery(rawQuery: string) {
  const query = rawQuery.trim();
  const compactDigits = query.replace(/[^0-9Xx]/g, '');

  if (/^(97(8|9))?\d{9}(\d|X)$/i.test(compactDigits)) {
    return `isbn:${compactDigits}`;
  }

  return query;
}

function normalizeCoverUrl(url?: string) {
  if (!url) {
    return null;
  }

  return url.replace(/^http:\/\//i, 'https://');
}

function normalizeExternalBook(volume: GoogleBooksVolume): ExternalBook | null {
  const title = volume.volumeInfo?.title?.trim();
  const author = volume.volumeInfo?.authors?.filter(Boolean).join(', ').trim();

  if (!title || !author) {
    return null;
  }

  return {
    external_id: volume.id,
    title,
    author,
    description: volume.volumeInfo?.description?.trim() ?? null,
    cover_url: normalizeCoverUrl(
      volume.volumeInfo?.imageLinks?.thumbnail ?? volume.volumeInfo?.imageLinks?.smallThumbnail
    ),
    publisher: volume.volumeInfo?.publisher?.trim() ?? null,
    published_at: volume.volumeInfo?.publishedDate?.trim() ?? null,
    page_count: volume.volumeInfo?.pageCount ?? null,
    categories: volume.volumeInfo?.categories ?? [],
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (query.length < 3) {
    return Response.json({ books: [] satisfies ExternalBook[] });
  }

  const params = new URLSearchParams({
    q: normalizeGoogleBooksQuery(query),
    langRestrict: 'pt',
    maxResults: '10',
    orderBy: 'relevance',
    printType: 'books',
    projection: 'lite',
  });

  if (env.GOOGLE_BOOKS_API_KEY) {
    params.set('key', env.GOOGLE_BOOKS_API_KEY);
  }

  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
    next: {
      revalidate: 60 * 60,
    },
  });

  if (!response.ok) {
    return Response.json(
      {
        error: 'Não foi possível buscar livros agora.',
      },
      {
        status: response.status,
      }
    );
  }

  const payload = (await response.json()) as { items?: GoogleBooksVolume[] };
  const books = (payload.items ?? [])
    .map((item) => normalizeExternalBook(item))
    .filter((item): item is ExternalBook => Boolean(item));

  return Response.json({ books });
}
