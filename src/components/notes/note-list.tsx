import { NoteListItem } from '@/components/notes/note-list-item';
import type { Note } from '@/components/notes/types';
import { Separator } from '@/components/ui/separator';

type NoteListProps = {
  notes: Note[];
  onOpen: (note: Note) => void;
  emptyMessage?: string;
};

export function NoteList({
  notes,
  onOpen,
  emptyMessage = 'Toque no botão abaixo para adicionar uma ideia, trecho, resumo ou áudio.',
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-muted-foreground border-border/80 rounded-lg border border-dashed px-4 py-4 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="divide-border border-border/70 bg-card/40 rounded-xl border">
      {notes.map((note, index) => (
        <div key={note.id}>
          <NoteListItem note={note} onOpen={onOpen} />
          {index < notes.length - 1 ? <Separator /> : null}
        </div>
      ))}
    </div>
  );
}
