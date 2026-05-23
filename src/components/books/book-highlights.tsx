import { Quote } from 'lucide-react';

import type { BookContext, Book } from '@/components/books/types';
import { EmptyState } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';

type BookHighlightsProps = {
  book: Book;
  context: BookContext;
};

export function BookHighlights({ context }: BookHighlightsProps) {
  const highlights = context.highlights;

  if (highlights.length === 0) {
    return (
      <EmptyState
        title="Nenhum destaque salvo"
        description="Trechos marcados vao aparecer aqui quando voce quiser guardar frases que valem releitura."
        icon={<Quote className="size-5" />}
      />
    );
  }

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm tracking-[0.12em] uppercase">Destaques</p>
        <h2 className="font-editorial text-3xl leading-none tracking-[-0.03em]">
          Trechos para voltar devagar
        </h2>
      </div>

      <div className="grid gap-4">
        {highlights.map((highlight) => (
          <Card
            key={highlight.id}
            className="bg-card/70 border-border/60 rounded-[1.75rem] py-0 shadow-none"
          >
            <CardContent className="space-y-4 py-6">
              <p className="text-muted-foreground text-sm">{highlight.label}</p>
              <blockquote className="font-editorial text-2xl leading-tight tracking-[-0.02em]">
                “{highlight.excerpt}”
              </blockquote>
              {highlight.note ? (
                <p className="text-muted-foreground text-sm leading-7">{highlight.note}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
