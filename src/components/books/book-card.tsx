import Link from 'next/link';

import { ArrowUpRight, Star } from 'lucide-react';

import type { Book } from '@/components/books/types';
import { formatBookDate, formatBookRating, getBookStatusMeta } from '@/components/books/utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BookCardProps = {
  book: Book;
  variant?: 'default' | 'compact' | 'featured';
  showReflection?: boolean;
};

export function BookCard({ book, variant = 'default' }: BookCardProps) {
  const statusMeta = getBookStatusMeta(book.status);
  const isCompact = variant === 'compact';

  return (
    <Link
      href={`/books/${book.id}`}
      className={cn(
        'bg-card/75 hover:bg-card border-border/70 block rounded-xl border px-4 py-4 shadow-none transition-colors sm:px-5',
        isCompact && 'rounded-lg'
      )}
    >
      <div className={cn('flex items-start justify-between gap-4', isCompact && 'gap-3')}>
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusMeta.badgeVariant} className="rounded-full">
              {statusMeta.label}
            </Badge>
            <span className="text-muted-foreground text-xs">
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
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span>{statusMeta.label}</span>
            {book.status === 'completed' ? (
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-3.5" />
                {formatBookRating(book.rating ?? undefined)}
              </span>
            ) : null}
          </div>
        </div>

        <ArrowUpRight className="text-muted-foreground mt-1 size-4 shrink-0" />
      </div>

      <p className="text-muted-foreground mt-4 text-xs">Abrir livro para escrever nova nota.</p>
    </Link>
  );
}
