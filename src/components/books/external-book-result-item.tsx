import { BookCover } from '@/components/books/book-cover';
import type { ExternalBook } from '@/components/books/types';
import { Button } from '@/components/ui/button';

type ExternalBookResultItemProps = {
  book: ExternalBook;
  onSelect: (book: ExternalBook) => void;
};

export function ExternalBookResultItem({ book, onSelect }: ExternalBookResultItemProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="border-border/70 hover:bg-accent/50 flex h-auto w-full max-w-full min-w-0 items-start justify-start gap-3 overflow-hidden rounded-lg border px-3 py-3 text-left whitespace-normal sm:px-4"
      onClick={() => onSelect(book)}
    >
      <BookCover
        alt={`Capa de ${book.title}`}
        coverUrl={book.cover_url}
        className="h-16 w-11 shrink-0 sm:h-20 sm:w-14"
      />

      <div className="min-w-0 flex-1 space-y-1">
        <p className="line-clamp-2 text-sm leading-6 font-medium">{book.title}</p>
        <p className="text-muted-foreground line-clamp-1 text-sm">{book.author}</p>
        <p className="text-muted-foreground line-clamp-1 text-xs">
          {[book.publisher, book.published_at].filter(Boolean).join(' • ') || 'Livro encontrado'}
        </p>
      </div>
    </Button>
  );
}
