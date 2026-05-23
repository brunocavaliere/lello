'use client';

import { useMemo, useState } from 'react';

import { NOTE_CATEGORY_OPTIONS } from '@/components/notes/constants';
import type { Note } from '@/components/notes/types';
import { useCreateTextNote, useDeleteNote, useUpdateTextNote } from '@/components/notes/hooks';
import { RichTextEditor } from '@/components/notes/rich-text-editor';
import { extractTextFromHtml } from '@/components/notes/utils';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { dismissToast, showErrorToast, showLoadingToast, showSuccessToast } from '@/lib/toast';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type NoteEditorDrawerProps = {
  bookId: string;
  note?: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NoteEditorDrawer({ bookId, note, open, onOpenChange }: NoteEditorDrawerProps) {
  const createNote = useCreateTextNote(bookId);
  const updateNote = useUpdateTextNote(bookId);
  const deleteNote = useDeleteNote(bookId);
  const [title, setTitle] = useState(note?.title ?? '');
  const [category, setCategory] = useState(note?.category ?? 'note');
  const [contentHtml, setContentHtml] = useState(note?.content_html ?? '');
  const [contentText, setContentText] = useState(note?.content_text ?? '');
  const isEditing = Boolean(note);

  const editorKey = useMemo(
    () => `${note?.id ?? 'new'}:${open ? 'open' : 'closed'}`,
    [note?.id, open]
  );

  async function handleSave() {
    const plainText = contentText.trim() || extractTextFromHtml(contentHtml);

    if (!plainText) {
      showErrorToast('Nada para salvar.', {
        description: 'Escreva algo que vale lembrar.',
      });
      return;
    }

    const loadingToastId = showLoadingToast(isEditing ? 'Salvando nota...' : 'Criando nota...');

    try {
      if (note) {
        await updateNote.mutateAsync({
          id: note.id,
          title: title.trim(),
          category,
          contentHtml,
          contentText: plainText,
        });
      } else {
        await createNote.mutateAsync({
          bookId,
          title: title.trim(),
          category,
          contentHtml,
          contentText: plainText,
        });
      }

      showSuccessToast(isEditing ? 'Nota atualizada.' : 'Nota salva.');
      onOpenChange(false);
    } catch (error) {
      showErrorToast('Nao foi possivel salvar a nota.', {
        description:
          error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
      });
    } finally {
      dismissToast(loadingToastId);
    }
  }

  async function handleDelete() {
    if (!note) {
      return;
    }

    const confirmed = window.confirm('Excluir nota?');

    if (!confirmed) {
      return;
    }

    const loadingToastId = showLoadingToast('Excluindo nota...');

    try {
      await deleteNote.mutateAsync(note);
      showSuccessToast('Nota excluida.');
      onOpenChange(false);
    } catch (error) {
      showErrorToast('Nao foi possivel excluir a nota.', {
        description:
          error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
      });
    } finally {
      dismissToast(loadingToastId);
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[92dvh] max-h-[92dvh] px-0 pb-0">
        <DrawerHeader className="border-border/70 gap-3 border-b px-5 pt-6 pb-4 sm:px-6 sm:pt-7">
          <DrawerTitle className="font-editorial text-2xl tracking-[-0.03em]">
            {isEditing ? 'Editar nota' : 'Nova nota'}
          </DrawerTitle>
          <DrawerDescription className="max-w-sm text-sm leading-6">
            {isEditing
              ? 'Atualize o que ainda vale lembrar.'
              : 'Anote uma ideia, resumo ou reflexão.'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]">
              <div className="space-y-2.5">
                <label htmlFor="note-title" className="text-sm font-medium">
                  Titulo
                </label>
                <Input
                  id="note-title"
                  key={`title-${note?.id ?? 'new'}-${open ? 'open' : 'closed'}`}
                  defaultValue={note?.title ?? ''}
                  placeholder="Ex.: Ideia central do capitulo"
                  className="bg-background dark:bg-background h-10 rounded-lg text-sm"
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>

              <div className="space-y-2.5">
                <label htmlFor="note-category" className="text-sm font-medium">
                  Categoria
                </label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as typeof category)}
                >
                  <SelectTrigger
                    id="note-category"
                    className="bg-background dark:bg-background h-10 w-full rounded-lg text-sm shadow-xs"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTE_CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex min-h-[12rem] flex-1 flex-col">
              <RichTextEditor
                key={editorKey}
                className="flex min-h-0 flex-1 flex-col"
                toolbarClassName="shrink-0"
                editorClassName="min-h-full flex-1 rounded-none border-0 bg-transparent px-4 py-4"
                placeholder="O que você quer anotar?"
                initialContent={note?.content_html ?? ''}
                onChange={({ html, text }) => {
                  setContentHtml(html);
                  setContentText(text);
                }}
              />
            </div>
          </div>

          <DrawerFooter className="border-border/70 bg-background/96 gap-3 border-t px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] backdrop-blur sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                className="rounded-full"
                disabled={createNote.isPending || updateNote.isPending}
                onClick={() => handleSave()}
              >
                Salvar nota
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              {note ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full"
                  disabled={deleteNote.isPending}
                  onClick={() => handleDelete()}
                >
                  Excluir nota
                </Button>
              ) : null}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
