'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeferredValue, useMemo, useState } from 'react';

import { BookOpen, Check, MoreHorizontal, Play, RotateCcw, Search } from 'lucide-react';

import { AddBookSheet } from '@/components/books/add-book-sheet';
import { BookHeader } from '@/components/books/book-header';
import { BookNoteComposer } from '@/components/books/book-note-composer';
import { useBook, useDeleteBook, useUpdateBook } from '@/components/books/hooks';
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
import {
  formatBookDate,
  formatBookRating,
  getBookStatusTransition,
} from '@/components/books/utils';
import { EmptyState, LoadingState, PageContainer } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const router = useRouter();
  const query = useBook(bookId);
  const deleteBook = useDeleteBook(bookId);
  const updateBook = useUpdateBook(bookId);
  const notesQuery = useBookNotes(bookId);
  const deleteNote = useDeleteNote(bookId);
  const context = getBookContext(bookId);
  const [isBookEditorOpen, setIsBookEditorOpen] = useState(false);
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

  async function handleDeleteBook() {
    const confirmed = window.confirm('Excluir livro?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteBook.mutateAsync();
      showSuccessToast('Livro excluido.');
      router.replace('/');
      router.refresh();
    } catch (error) {
      showErrorToast('Nao foi possivel excluir o livro.', {
        description:
          error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
      });
    }
  }

  async function handleStatusChange(status: 'want_to_read' | 'reading' | 'completed') {
    if (!query.data || query.data.status === status) {
      return;
    }

    try {
      await updateBook.mutateAsync(getBookStatusTransition(query.data, status));
      showSuccessToast(
        status === 'reading'
          ? 'Leitura iniciada.'
          : status === 'completed'
            ? 'Livro marcado como concluído.'
            : 'Livro movido para a wishlist.'
      );
    } catch (error) {
      showErrorToast('Nao foi possivel atualizar o status.', {
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

  const nextStatus =
    query.data.status === 'want_to_read'
      ? 'reading'
      : query.data.status === 'reading'
        ? 'completed'
        : 'reading';

  return (
    <PageContainer className="mx-auto w-full max-w-3xl gap-5">
      <BookHeader
        book={query.data}
        context={context}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm" className="shrink-0">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Ações do livro</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsBookEditorOpen(true)}>
                Editar livro
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => void handleDeleteBook()}>
                Excluir livro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <section className="bg-card/60 border-border/70 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {query.data.status === 'want_to_read'
              ? 'Pronto para começar?'
              : query.data.status === 'reading'
                ? 'Leitura em andamento'
                : 'Leitura concluída'}
          </p>
          <p className="text-muted-foreground text-xs">
            {query.data.started_at ? `Começou em ${formatBookDate(query.data.started_at)}.` : null}{' '}
            {query.data.completed_at
              ? `Concluído em ${formatBookDate(query.data.completed_at)}.`
              : 'As datas são preenchidas automaticamente.'}
          </p>
        </div>

        <Button
          type="button"
          variant={query.data.status === 'completed' ? 'outline' : 'default'}
          className="rounded-full"
          disabled={updateBook.isPending}
          onClick={() => void handleStatusChange(nextStatus)}
        >
          {query.data.status === 'want_to_read' ? (
            <Play className="size-4" />
          ) : query.data.status === 'reading' ? (
            <Check className="size-4" />
          ) : (
            <RotateCcw className="size-4" />
          )}
          {query.data.status === 'want_to_read'
            ? 'Começar leitura'
            : query.data.status === 'reading'
              ? 'Marcar como concluído'
              : 'Ler novamente'}
        </Button>
      </section>

      {query.data.rating || query.data.review ? (
        <section className="border-border/70 space-y-3 border-b pb-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-editorial text-2xl font-semibold tracking-[-0.03em]">
              Minha avaliação
            </h2>
            {query.data.rating ? (
              <Badge variant="outline" className="rounded-full">
                {formatBookRating(query.data.rating)}
              </Badge>
            ) : null}
          </div>
          {query.data.review ? (
            <p className="text-muted-foreground leading-7">{query.data.review}</p>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-4 pb-24">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-editorial text-2xl font-semibold tracking-[-0.03em]">
              Notas adicionais
            </h2>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              Um espaço opcional para guardar ideias, trechos ou resumos.
            </p>
          </div>
          <span className="text-muted-foreground text-xs">Você não precisa anotar nada.</span>
        </div>

        <BookNoteComposer
          onSelectAudioNote={handleCreateAudioNote}
          onSelectTextNote={handleCreateTextNote}
        />

        {notes.length > 0 ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar nas notas..."
                className="bg-background h-11 rounded-lg pr-4 pl-10"
              />
            </div>

            <div className="-mx-1 [scrollbar-width:none] overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent">
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
        ) : null}

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
                : 'Ainda não há notas. Se quiser, você pode guardar algo sobre este livro.'
            }
          />
        )}
      </section>

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
      <AddBookSheet
        key={`${query.data.id}-${isBookEditorOpen ? 'open' : 'closed'}`}
        book={query.data}
        open={isBookEditorOpen}
        onOpenChange={setIsBookEditorOpen}
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
