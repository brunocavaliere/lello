import type { ReactNode } from 'react';

import { BookCover } from '@/components/books/book-cover';
import { BookDescriptionPreview } from '@/components/books/book-description-preview';
import { Badge } from '@/components/ui/badge';
import type { BookContext, Book } from '@/components/books/types';
import { formatBookDate, formatBookRating, getBookStatusMeta } from '@/components/books/utils';

type BookHeaderProps = {
  book: Book;
  context: BookContext;
  actions?: ReactNode;
};

export function BookHeader({ book, context, actions }: BookHeaderProps) {
  const statusMeta = getBookStatusMeta(book.status);
  const description = context.overview ?? book.description;

  return (
    <section className="border-border/70 space-y-3 border-b pb-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusMeta.badgeVariant} className="rounded-full">
            {statusMeta.label}
          </Badge>
          {book.status === 'completed' && book.rating ? (
            <Badge variant="outline" className="rounded-full">
              {formatBookRating(book.rating)}
            </Badge>
          ) : null}
          <span className="text-muted-foreground text-xs">
            Adicionado em {formatBookDate(book.created_at)}
          </span>
        </div>
        {actions}
      </div>

      <div className="flex items-start gap-4">
        <BookCover
          alt={`Capa de ${book.title}`}
          coverUrl={book.cover_url}
          className="h-28 w-20 shrink-0 sm:h-32 sm:w-24"
        />

        <div className="min-w-0 space-y-1.5">
          <h1 className="font-editorial text-3xl leading-tight font-semibold tracking-[-0.04em] sm:text-4xl">
            {book.title}
          </h1>
          <p className="text-muted-foreground text-sm">por {book.author}</p>
          {book.publisher || book.published_at ? (
            <p className="text-muted-foreground text-xs">
              {[book.publisher, book.published_at].filter(Boolean).join(' • ')}
            </p>
          ) : null}
        </div>
      </div>

      {description ? <BookDescriptionPreview description={description} title={book.title} /> : null}
    </section>
  );
}
