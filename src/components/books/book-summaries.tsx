import { FileText } from 'lucide-react';

import type { BookContext, Book } from '@/components/books/types';
import { EmptyState } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';

type BookSummariesProps = {
  book: Book;
  context: BookContext;
};

export function BookSummaries({ context }: BookSummariesProps) {
  const summaries = context.summaries;

  if (summaries.length === 0) {
    return (
      <EmptyState
        title="Nenhum resumo por enquanto"
        description="Quando voce condensar o livro com suas palavras, os resumos vao ficar aqui."
        icon={<FileText className="size-5" />}
      />
    );
  }

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm tracking-[0.12em] uppercase">Resumos</p>
        <h2 className="font-editorial text-3xl leading-none tracking-[-0.03em]">
          O que ficou em poucas linhas
        </h2>
      </div>

      <div className="grid gap-4">
        {summaries.map((summary) => (
          <Card
            key={summary.id}
            className="bg-card/70 border-border/60 rounded-[1.75rem] py-0 shadow-none"
          >
            <CardContent className="space-y-3 py-6">
              <p className="text-muted-foreground text-sm">{summary.label}</p>
              <p className="text-sm leading-8">{summary.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
