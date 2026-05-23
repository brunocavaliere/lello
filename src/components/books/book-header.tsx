import { Badge } from '@/components/ui/badge';
import type { BookContext, Book } from '@/components/books/types';
import { formatBookDate, formatBookRating, getBookStatusMeta } from '@/components/books/utils';

type BookHeaderProps = {
  book: Book;
  context: BookContext;
};

export function BookHeader({ book, context }: BookHeaderProps) {
  const statusMeta = getBookStatusMeta(book.status);

  return (
    <section className="border-border/70 space-y-3 border-b pb-5">
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

      <div className="space-y-1.5">
        <h1 className="font-editorial text-3xl leading-tight font-semibold tracking-[-0.04em] sm:text-4xl">
          {book.title}
        </h1>
        <p className="text-muted-foreground text-sm">por {book.author}</p>
      </div>

      {context.overview ? (
        <p className="text-muted-foreground max-w-3xl text-sm leading-7">{context.overview}</p>
      ) : null}
    </section>
  );
}
