import { NotebookPen } from 'lucide-react';

import type { BookContext, Book } from '@/components/books/types';
import { formatBookDate, getBookNotes, getBookNoteTypeLabel } from '@/components/books/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type BookReflectionsProps = {
  book: Book;
  context: BookContext;
};

export function BookReflections({ context }: BookReflectionsProps) {
  const notes = getBookNotes(context);

  return (
    <section className="space-y-3 pb-24">
      {notes.length === 0 ? (
        <div className="text-muted-foreground border-border/80 flex items-center gap-3 rounded-2xl border border-dashed px-4 py-4 text-sm">
          <NotebookPen className="size-4 shrink-0" />
          <p>Toque no botão abaixo para registrar uma ideia, trecho ou resumo.</p>
        </div>
      ) : (
        <div className="divide-border border-border/70 bg-card/40 rounded-2xl border">
          {notes.map((note, index) => (
            <article key={note.id} className="px-4 py-3 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full text-[11px]">
                      {getBookNoteTypeLabel(note.type)}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{note.label}</span>
                    {note.createdAt ? (
                      <span className="text-muted-foreground text-xs">
                        {formatBookDate(note.createdAt)}
                      </span>
                    ) : null}
                  </div>

                  <p className="line-clamp-3 text-sm leading-7">{note.content}</p>

                  {note.support ? (
                    <p className="text-muted-foreground line-clamp-2 text-xs leading-6">
                      {note.support}
                    </p>
                  ) : null}
                </div>
              </div>

              {index < notes.length - 1 ? <Separator className="mt-3" /> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
