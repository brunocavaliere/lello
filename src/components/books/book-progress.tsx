import type { BookContext, Book } from '@/components/books/types';
import { formatBookRating, getBookStatusMeta } from '@/components/books/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type BookProgressProps = {
  book: Book;
  context: BookContext;
};

export function BookProgress({ book, context }: BookProgressProps) {
  const statusMeta = getBookStatusMeta(book.status);

  return (
    <Card className="bg-card/70 border-border/60 rounded-[1.75rem] py-0 shadow-none">
      <CardContent className="space-y-5 py-6">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm tracking-[0.12em] uppercase">Leitura</p>
          <h2 className="font-editorial text-2xl leading-none tracking-[-0.03em]">
            Contexto rapido
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={statusMeta.badgeVariant} className="rounded-full">
            {statusMeta.label}
          </Badge>
          {book.status === 'completed' ? (
            <Badge variant="outline" className="rounded-full">
              {formatBookRating(book.rating ?? undefined)}
            </Badge>
          ) : null}
        </div>

        <div className="space-y-2 text-sm leading-7">
          <p>
            <span className="text-muted-foreground">Capitulo:</span>{' '}
            {context.currentChapter ?? 'Sem ponto de retomada registrado'}
          </p>
          <p className="text-muted-foreground">
            {context.resumeNote ?? 'Sem observacoes salvas para a retomada desta leitura.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
