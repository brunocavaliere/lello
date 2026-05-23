import { BOOK_CONTEXT_BY_ID, BOOK_STATUS_META } from '@/components/books/constants';
import type {
  Book,
  BookContext,
  BookNote,
  BookNoteType,
  BookStatus,
} from '@/components/books/types';

export function getBookStatusMeta(status: BookStatus) {
  return BOOK_STATUS_META[status];
}

export function formatBookRating(rating?: number) {
  if (!rating) {
    return 'Sem nota';
  }

  return `${rating.toFixed(1).replace('.', ',')}/5`;
}

export function formatBookDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function getBookNoteTypeLabel(type: BookNoteType) {
  switch (type) {
    case 'note':
      return 'Nota';
    case 'reflection':
      return 'Reflexao';
    case 'highlight':
      return 'Destaque';
    case 'summary':
      return 'Resumo';
  }
}

export function getBookNotes(context: BookContext): BookNote[] {
  return [
    ...context.reflections.map((reflection) => ({
      id: reflection.id,
      type: 'reflection' as const,
      label: reflection.label,
      content: reflection.content,
      createdAt: reflection.createdAt,
    })),
    ...context.highlights.map((highlight) => ({
      id: highlight.id,
      type: 'highlight' as const,
      label: highlight.label,
      content: highlight.excerpt,
      support: highlight.note,
      createdAt: highlight.createdAt,
    })),
    ...context.summaries.map((summary) => ({
      id: summary.id,
      type: 'summary' as const,
      label: summary.label,
      content: summary.content,
      createdAt: summary.createdAt,
    })),
  ].sort((left, right) => {
    const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;

    return rightTime - leftTime;
  });
}

export function getBooksByStatus(books: Book[], status: BookStatus) {
  return books.filter((book) => book.status === status);
}

export function getBooksWithReflections(books: Book[]) {
  return books.filter((book) => (BOOK_CONTEXT_BY_ID[book.id]?.reflections.length ?? 0) > 0);
}
