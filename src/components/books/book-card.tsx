import { BookCover } from '@/components/books/book-cover';
import Link from 'next/link';

import { ArrowUpRight } from 'lucide-react';

import type { Book } from '@/components/books/types';
import {
  formatBookDate,
  formatBookDateCompact,
  formatBookRating,
  getBookStatusMeta,
} from '@/components/books/utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BookCardProps = {
  book: Book;
  variant?: 'default' | 'compact' | 'grid' | 'featured';
  showReflection?: boolean;
};

export function BookCard({ book, variant = 'default' }: BookCardProps) {
  const statusMeta = getBookStatusMeta(book.status);
  const isCompact = variant === 'compact';
  const isGrid = variant === 'grid';

  if (isGrid) {
    return (
      <Link
        href={`/books/${book.id}`}
        className="bg-card/75 hover:bg-card border-border/70 flex h-full min-h-48 gap-3 rounded-xl border p-3 shadow-none transition-colors sm:gap-4 sm:p-4"
      >
        <div className="relative min-h-40 w-24 shrink-0 self-stretch sm:w-28">
          <BookCover
            alt={`Capa de ${book.title}`}
            coverUrl={book.cover_url}
            className="h-full w-full rounded-lg"
            imageClassName="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
          <div className="flex items-center justify-between gap-2">
            <Badge variant={statusMeta.badgeVariant} className="rounded-full">
              {statusMeta.label}
            </Badge>
            <ArrowUpRight className="text-muted-foreground size-4 shrink-0" />
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-editorial line-clamp-3 text-lg leading-tight font-semibold tracking-[-0.03em] sm:text-xl">
              {book.title}
            </h3>
          </div>
          <p className="text-muted-foreground text-sm">{book.author}</p>
          <div className="text-muted-foreground mt-auto flex flex-wrap gap-x-2 pt-2 text-xs">
            {book.completed_at ? <span>{formatBookDate(book.completed_at)}</span> : null}
            {book.rating ? <span>{formatBookRating(book.rating)}</span> : null}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/books/${book.id}`}
      className={cn(
        'bg-card/75 hover:bg-card border-border/70 block rounded-xl border px-4 py-4 shadow-none transition-colors sm:px-5',
        isCompact && 'rounded-lg'
      )}
    >
      <div className={cn('flex items-start gap-4', isCompact && 'gap-3')}>
        <BookCover
          alt={`Capa de ${book.title}`}
          coverUrl={book.cover_url}
          className={cn('h-24 w-16 shrink-0', isCompact && 'h-20 w-14')}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={statusMeta.badgeVariant} className="rounded-full">
              {statusMeta.label}
            </Badge>
            <span className="text-muted-foreground text-xs sm:hidden">
              {formatBookDateCompact(book.created_at)}
            </span>
            <span className="text-muted-foreground hidden text-xs sm:inline">
              Adicionado em {formatBookDate(book.created_at)}
            </span>
          </div>

          <div className="space-y-1">
            <h3
              className={cn(
                'font-editorial text-2xl leading-tight font-semibold tracking-[-0.03em]',
                isCompact && 'text-xl'
              )}
            >
              {book.title}
            </h3>
            <p className="text-muted-foreground text-sm">{book.author}</p>
            <div className="text-muted-foreground flex flex-wrap gap-x-2 text-xs">
              {book.completed_at ? (
                <span>Concluído em {formatBookDate(book.completed_at)}</span>
              ) : null}
              {book.rating ? <span>{formatBookRating(book.rating)}</span> : null}
            </div>
          </div>
        </div>

        <ArrowUpRight className="text-muted-foreground mt-1 size-4 shrink-0" />
      </div>
    </Link>
  );
}
