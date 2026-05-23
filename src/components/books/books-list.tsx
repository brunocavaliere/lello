import { BookOpenText } from 'lucide-react';

import { BOOKS_EMPTY_STATE } from '@/components/books/constants';
import { BookCard } from '@/components/books/book-card';
import type { Book } from '@/components/books/types';
import { EmptyState } from '@/components/shared';
import { cn } from '@/lib/utils';

type BooksListProps = {
  books: Book[];
  layout?: 'grid' | 'stack';
  variant?: 'default' | 'compact' | 'featured';
  showReflection?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

export function BooksList({
  books,
  layout = 'stack',
  variant = 'default',
  emptyTitle = BOOKS_EMPTY_STATE.books.title,
  emptyDescription = BOOKS_EMPTY_STATE.books.description,
  className,
}: BooksListProps) {
  if (books.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<BookOpenText className="size-5" />}
        className="h-full max-h-[600px] min-h-[320px]"
      />
    );
  }

  return (
    <div
      className={cn(
        'grid gap-3',
        layout === 'grid' && 'lg:grid-cols-2',
        layout === 'stack' && 'grid-cols-1',
        className
      )}
    >
      {books.map((book) => (
        <BookCard key={book.id} book={book} variant={variant} />
      ))}
    </div>
  );
}
