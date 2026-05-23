'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';

import { BookOpen, Search } from 'lucide-react';

import { BookHeader } from '@/components/books/book-header';
import { BookNoteComposer } from '@/components/books/book-note-composer';
import { useBook } from '@/components/books/hooks';
import { getBookContext } from '@/components/books/services';
import {
  AudioNoteRecorderDrawer,
  NoteEditorDrawer,
  NoteList,
  NoteViewDrawer,
  useBookNotes,
  useDeleteNote,
  getNoteCategoryLabel,
  matchesNoteSearch,
} from '@/components/notes';
import type { Note, NoteCategory } from '@/components/notes';
import { EmptyState, LoadingState, PageContainer } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

type BookDetailWorkspaceProps = {
  bookId: string;
};

type CategoryFilter = 'all' | NoteCategory;

const NOTE_CATEGORY_FILTERS: Array<{ label: string; value: CategoryFilter }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Notas', value: 'note' },
  { label: 'Reflexões', value: 'reflection' },
  { label: 'Citações', value: 'quote' },
  { label: 'Resumos', value: 'summary' },
];

export function BookDetailWorkspace({ bookId }: BookDetailWorkspaceProps) {
  const query = useBook(bookId);
  const notesQuery = useBookNotes(bookId);
  const deleteNote = useDeleteNote(bookId);
  const context = getBookContext(bookId);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAudioRecorderOpen, setIsAudioRecorderOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const deferredSearch = useDeferredValue(search);
  const notes = useMemo(
    () => (notesQuery.isError ? [] : (notesQuery.data ?? [])),
    [notesQuery.data, notesQuery.isError]
  );
  const visibleNotes = useMemo(
    () =>
      notes.filter((note) => {
        const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;

        return matchesCategory && matchesNoteSearch(note, deferredSearch);
      }),
    [categoryFilter, deferredSearch, notes]
  );
  const hasFilters = search.trim().length > 0 || categoryFilter !== 'all';

  function handleCreateTextNote() {
    setSelectedNote(null);
    setIsEditorOpen(true);
  }

  function handleCreateAudioNote() {
    setSelectedNote(null);
    setIsAudioRecorderOpen(true);
  }

  function handleEditNote(note: Note) {
    setSelectedNote(note);
    setIsEditorOpen(true);
  }

  function handleOpenNote(note: Note) {
    setSelectedNote(note);
    setIsViewerOpen(true);
  }

  async function handleDeleteNote(note: Note) {
    const confirmed = window.confirm('Excluir nota?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteNote.mutateAsync(note);
      showSuccessToast('Nota excluida.');
      setIsViewerOpen(false);
    } catch (error) {
      showErrorToast('Nao foi possivel excluir a nota.', {
        description:
          error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
      });
    }
  }

  if (query.isPending) {
    return (
      <PageContainer>
        <LoadingState
          title="Abrindo livro"
          description="Carregando notas e contexto desta leitura."
          lines={4}
        />
      </PageContainer>
    );
  }

  if (query.isError || !query.data) {
    return (
      <PageContainer>
        <EmptyState
          title="Livro nao encontrado"
          description="Este livro nao existe mais na biblioteca ou ainda nao foi criado."
          icon={<BookOpen className="size-5" />}
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/library">Voltar para biblioteca</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="mx-auto w-full max-w-3xl gap-5">
      <BookHeader book={query.data} context={context} />

      <section className="space-y-4 pb-24">
        <div className="space-y-3">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar neste livro..."
              className="bg-background h-11 rounded-lg pr-4 pl-10"
            />
          </div>

          <div className="-mx-1 mb-8 [scrollbar-width:none] overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="flex min-w-max items-center gap-2">
              {NOTE_CATEGORY_FILTERS.map((filter) => (
                <Button
                  key={filter.value}
                  type="button"
                  variant={categoryFilter === filter.value ? 'default' : 'outline'}
                  className="rounded-sm"
                  onClick={() => setCategoryFilter(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {hasFilters ? (
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline" className="rounded-md px-3 py-1">
                {categoryFilter === 'all' ? 'Todos' : getNoteCategoryLabel(categoryFilter)}
              </Badge>
              {search.trim() ? <span>“{search.trim()}”</span> : null}
            </div>
          ) : null}
        </div>

        {notesQuery.isPending ? (
          <div className="text-muted-foreground border-border/70 rounded-lg border px-4 py-4 text-sm">
            Carregando notas...
          </div>
        ) : (
          <NoteList
            notes={visibleNotes}
            onOpen={handleOpenNote}
            emptyMessage={
              hasFilters
                ? 'Nenhuma nota encontrada com essa busca ou filtro.'
                : 'Toque no botão abaixo para adicionar uma ideia, trecho, resumo ou áudio.'
            }
          />
        )}
      </section>

      <BookNoteComposer
        onSelectAudioNote={handleCreateAudioNote}
        onSelectTextNote={handleCreateTextNote}
      />
      <NoteViewDrawer
        note={selectedNote}
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        isDeleting={deleteNote.variables?.id === selectedNote?.id}
      />
      <AudioNoteRecorderDrawer
        bookId={bookId}
        open={isAudioRecorderOpen}
        onOpenChange={setIsAudioRecorderOpen}
      />
      <NoteEditorDrawer
        key={`${selectedNote?.id ?? 'new'}:${isEditorOpen ? 'open' : 'closed'}`}
        bookId={bookId}
        note={selectedNote?.type === 'text' ? selectedNote : null}
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
      />
    </PageContainer>
  );
}
