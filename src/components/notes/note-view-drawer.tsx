'use client';

import { AudioNotePlayer } from '@/components/notes/audio-note-player';
import type { Note } from '@/components/notes/types';
import {
  formatNoteDate,
  getNoteCategoryLabel,
  getNoteTitle,
  getNoteTypeLabel,
} from '@/components/notes/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

type NoteViewDrawerProps = {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  isDeleting?: boolean;
};

export function NoteViewDrawer({
  note,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  isDeleting = false,
}: NoteViewDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mt-0 h-[90vh] rounded-t-[1.75rem] border-0 px-0 pb-0 shadow-none">
        {note ? (
          <>
            <DrawerHeader className="border-border/70 gap-3 border-b px-5 pt-6 pb-5 sm:px-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  {getNoteCategoryLabel(note.category)}
                </Badge>
                {note.type === 'audio' ? (
                  <span className="text-muted-foreground text-xs">
                    {getNoteTypeLabel(note.type)}
                  </span>
                ) : null}
                <span className="text-muted-foreground text-xs">
                  {formatNoteDate(note.created_at)}
                </span>
              </div>
              <DrawerTitle className="font-editorial text-2xl tracking-[-0.03em]">
                {getNoteTitle(note.title, note.content_text)}
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                {note.type === 'audio'
                  ? 'Visualize e ouça os detalhes desta nota de áudio.'
                  : 'Visualize os detalhes desta nota.'}
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-7">
              {note.type === 'audio' && note.audio_url ? (
                <div className="space-y-4">
                  <AudioNotePlayer
                    key={note.id}
                    audioUrl={note.audio_url}
                    durationSeconds={note.audio_duration_seconds}
                  />
                  <p className="text-muted-foreground text-sm leading-7">
                    Toque para ouvir este registro do seu momento de leitura.
                  </p>
                </div>
              ) : (
                <div
                  className="[&_blockquote]:border-border [&_blockquote]:text-muted-foreground [&_h2]:font-editorial text-[15px] leading-8 sm:text-base [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_h2]:my-4 [&_h2]:text-2xl [&_h2]:leading-tight [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: note.content_html ?? '' }}
                />
              )}
            </div>

            <DrawerFooter className="border-border/70 bg-background/96 gap-3 border-t px-5 py-4 backdrop-blur sm:px-6">
              <div className="flex flex-wrap items-center gap-3">
                {note.type === 'text' ? (
                  <Button
                    type="button"
                    className="rounded-full"
                    onClick={() => {
                      onOpenChange(false);
                      onEdit(note);
                    }}
                  >
                    Editar nota
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant={note.type === 'text' ? 'ghost' : 'outline'}
                  className="rounded-full"
                  disabled={isDeleting}
                  onClick={() => onDelete(note)}
                >
                  Excluir nota
                </Button>
              </div>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
