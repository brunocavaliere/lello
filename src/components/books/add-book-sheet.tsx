'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookPlus, LoaderCircle, Search } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';

import { BOOK_STATUS_OPTIONS } from '@/components/books/constants';
import { BookCover } from '@/components/books/book-cover';
import { ExternalBookResultItem } from '@/components/books/external-book-result-item';
import { useCreateBook, useExternalBookSearch, useUpdateBook } from '@/components/books/hooks';
import { createBookSchema } from '@/components/books/schemas';
import type { Book, ExternalBook } from '@/components/books/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { dismissToast, showErrorToast, showLoadingToast, showSuccessToast } from '@/lib/toast';
import { cn } from '@/lib/utils';

type CreateBookValues = z.infer<typeof createBookSchema>;
type CreateBookInputValues = z.input<typeof createBookSchema>;

type AddBookSheetProps = {
  triggerLabel?: string;
  book?: Book | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  onSuccess?: () => void;
};

export function AddBookSheet({
  triggerLabel = 'Adicionar livro',
  book,
  open,
  onOpenChange,
  trigger,
  onSuccess,
}: AddBookSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<ExternalBook | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const createBook = useCreateBook();
  const updateBook = useUpdateBook(book?.id ?? '');
  const isEditing = Boolean(book);
  const isOpen = open ?? internalOpen;

  const form = useForm<CreateBookInputValues, undefined, CreateBookValues>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: book?.title ?? '',
      author: book?.author ?? '',
      status: book?.status ?? 'want_to_read',
      description: book?.description ?? null,
      cover_url: book?.cover_url ?? null,
      publisher: book?.publisher ?? null,
      published_at: book?.published_at ?? null,
    },
  });
  const watchedCoverUrl = useWatch({
    control: form.control,
    name: 'cover_url',
  });
  const watchedTitle = useWatch({
    control: form.control,
    name: 'title',
  });
  const searchQuery = watchedTitle?.trim() ?? '';
  const searchBooks = useExternalBookSearch(searchQuery, isSearchEnabled);

  const hasSearched = searchQuery.trim().length >= 3;
  const searchResults = searchBooks.data ?? [];
  const showSearchEmpty =
    hasSearched &&
    isSearchOpen &&
    !searchBooks.isPending &&
    !searchBooks.isError &&
    searchResults.length === 0;
  const showSearchResults = hasSearched && isSearchOpen;

  const selectedBookMeta = useMemo(
    () => [selectedBook?.publisher, selectedBook?.published_at].filter(Boolean).join(' • '),
    [selectedBook]
  );

  function setOpen(nextOpen: boolean) {
    onOpenChange?.(nextOpen);

    if (open === undefined) {
      setInternalOpen(nextOpen);
    }
  }

  function resetFlow() {
    setIsSearchOpen(false);
    setIsSearchEnabled(false);
    setSelectedBook(null);
    form.reset({
      title: book?.title ?? '',
      author: book?.author ?? '',
      status: book?.status ?? 'want_to_read',
      description: book?.description ?? null,
      cover_url: book?.cover_url ?? null,
      publisher: book?.publisher ?? null,
      published_at: book?.published_at ?? null,
    });
  }

  async function handleSubmit(values: CreateBookValues) {
    const loadingToastId = showLoadingToast(isEditing ? 'Salvando livro...' : 'Criando livro...', {
      description: isEditing
        ? 'Atualizando dados da sua biblioteca.'
        : 'Enviando dados para sua biblioteca.',
    });

    try {
      if (book) {
        await updateBook.mutateAsync({
          author: values.author,
          cover_url: values.cover_url ?? null,
          description: values.description ?? null,
          published_at: values.published_at ?? null,
          publisher: values.publisher ?? null,
          status: values.status,
          title: values.title,
        });
      } else {
        await createBook.mutateAsync({
          author: values.author,
          cover_url: values.cover_url ?? null,
          description: values.description ?? null,
          published_at: values.published_at ?? null,
          publisher: values.publisher ?? null,
          status: values.status,
          title: values.title,
        });
      }

      showSuccessToast(book ? 'Livro atualizado.' : 'Livro adicionado.', {
        description: 'Sua biblioteca foi atualizada com sucesso.',
      });
      resetFlow();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      showErrorToast(
        book ? 'Nao foi possivel atualizar o livro.' : 'Nao foi possivel salvar o livro.',
        {
          description:
            error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
        }
      );
    } finally {
      dismissToast(loadingToastId);
    }
  }

  function handleSelectExternalBook(book: ExternalBook) {
    setSelectedBook(book);
    setIsSearchEnabled(false);
    form.reset({
      title: book.title,
      author: book.author,
      status: form.getValues('status') ?? 'want_to_read',
      description: book.description ?? null,
      cover_url: book.cover_url ?? null,
      publisher: book.publisher ?? null,
      published_at: book.published_at ?? null,
    });
    setIsSearchOpen(false);
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetFlow();
        }
      }}
    >
      {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
      {!trigger && open === undefined ? (
        <SheetTrigger asChild>
          <Button className="rounded-full">
            <BookPlus className="size-4" />
            {triggerLabel}
          </Button>
        </SheetTrigger>
      ) : null}

      <SheetContent className="w-full gap-0 sm:max-w-lg">
        <SheetHeader className="border-border/70 border-b px-6 py-5">
          <SheetTitle className="font-editorial text-3xl tracking-[-0.03em]">
            {isEditing ? 'Editar livro' : 'Adicionar livro'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Busque outra edição do livro ou ajuste os dados manualmente.'
              : 'Busque um livro para preencher os dados automaticamente ou complete manualmente.'}
          </SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto px-6 py-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => handleSubmit(values))}
              className="space-y-5"
              noValidate
            >
              <div className="flex items-start gap-3 rounded-lg border px-3 py-3">
                <BookCover
                  alt={selectedBook ? `Capa de ${selectedBook.title}` : 'Sem capa'}
                  coverUrl={watchedCoverUrl}
                  className="h-20 w-14 shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium">
                    {selectedBook ? 'Livro encontrado' : isEditing ? 'Livro atual' : 'Novo livro'}
                  </p>
                  <p className="text-muted-foreground text-sm leading-6">
                    {selectedBookMeta ||
                      'Digite um livro, autor ou ISBN para preencher os dados automaticamente.'}
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Livro</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onFocus={() => {
                            if ((field.value ?? '').trim().length >= 3) {
                              setIsSearchOpen(true);
                            }
                          }}
                          onChange={(event) => {
                            const nextValue = event.target.value;

                            field.onChange(nextValue);

                            if (selectedBook && nextValue.trim() !== selectedBook.title) {
                              setSelectedBook(null);
                            }

                            setIsSearchEnabled(true);
                            setIsSearchOpen(nextValue.trim().length >= 3);
                          }}
                          placeholder="Digite o nome do livro, autor ou ISBN"
                          className="h-10 pl-9"
                        />
                      </div>
                    </FormControl>
                    {showSearchResults ? (
                      <div className="border-border/70 bg-background max-w-full min-w-0 overflow-hidden rounded-lg border">
                        {searchBooks.isPending ? (
                          <div className="text-muted-foreground flex items-center gap-2 px-4 py-4 text-sm">
                            <LoaderCircle className="size-4 animate-spin" />
                            Buscando livros...
                          </div>
                        ) : null}

                        {searchBooks.isError ? (
                          <div className="text-muted-foreground px-4 py-4 text-sm leading-6">
                            Não foi possível buscar livros agora. Continue digitando manualmente.
                          </div>
                        ) : null}

                        {showSearchEmpty ? (
                          <div className="text-muted-foreground px-4 py-4 text-sm leading-6">
                            Nenhum resultado encontrado. Você pode continuar preenchendo
                            manualmente.
                          </div>
                        ) : null}

                        {searchResults.length > 0 ? (
                          <div className="max-h-[17.5rem] min-w-0 space-y-2 overflow-y-auto p-2">
                            {searchResults.map((book) => (
                              <ExternalBookResultItem
                                key={book.external_id}
                                book={book}
                                onSelect={handleSelectExternalBook}
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs">
                        Comece com pelo menos 3 caracteres.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Cal Newport" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BOOK_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={cn('mt-4 w-full rounded-full')}
                disabled={
                  form.formState.isSubmitting || createBook.isPending || updateBook.isPending
                }
              >
                {createBook.isPending || updateBook.isPending
                  ? isEditing
                    ? 'Salvando...'
                    : 'Adicionando...'
                  : isEditing
                    ? 'Salvar alterações'
                    : 'Adicionar livro'}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
