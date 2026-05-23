import { ChevronRight } from 'lucide-react';

import type { Note } from '@/components/notes/types';
import {
  formatAudioDuration,
  formatNoteDate,
  getNoteCategoryLabel,
  getNotePreview,
  getNoteTitle,
  getNoteTypeLabel,
} from '@/components/notes/utils';
import { Badge } from '@/components/ui/badge';

type NoteListItemProps = {
  note: Note;
  onOpen: (note: Note) => void;
};

export function NoteListItem({ note, onOpen }: NoteListItemProps) {
  return (
    <article className="px-4 py-3 sm:px-5">
      <button
        type="button"
        className="w-full text-left"
        onClick={() => onOpen(note)}
        aria-label="Abrir nota"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full text-[11px]">
                {getNoteCategoryLabel(note.category)}
              </Badge>
              {note.type === 'audio' ? (
                <span className="text-muted-foreground text-[11px]">
                  {getNoteTypeLabel(note.type)}
                </span>
              ) : null}
              <span className="text-muted-foreground text-xs">
                {formatNoteDate(note.created_at)}
              </span>
            </div>

            <div className="space-y-1">
              <p className="truncate text-sm font-medium">
                {getNoteTitle(note.title, note.content_text)}
              </p>
              {note.type === 'audio' ? (
                <p className="text-muted-foreground text-sm leading-7">
                  {formatAudioDuration(note.audio_duration_seconds)} de áudio
                </p>
              ) : (
                <p className="text-muted-foreground line-clamp-2 text-sm leading-7">
                  {getNotePreview(note.content_text, 220)}
                </p>
              )}
            </div>
          </div>

          <ChevronRight className="text-muted-foreground mt-1 size-4 shrink-0" />
        </div>
      </button>
    </article>
  );
}
