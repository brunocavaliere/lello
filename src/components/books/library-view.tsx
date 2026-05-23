'use client';

import { startTransition, useDeferredValue, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowDownAZ, BookOpen, Search, SlidersHorizontal } from 'lucide-react';

import { AddBookSheet } from '@/components/books/add-book-sheet';
import { BooksList } from '@/components/books/books-list';
import { useBooks } from '@/components/books/hooks';
import type { Book } from '@/components/books/types';
import { EmptyState, LoadingState, PageContainer } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isSupabaseConfigured } from '@/lib/supabase/config';

type SortOption = 'alphabetical' | 'rating' | 'date_added';
type StatusFilter = 'all' | Book['status'];

const STATUS_FILTERS: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Estou lendo', value: 'reading' },
  { label: 'Quero ler', value: 'want_to_read' },
  { label: 'Já li', value: 'completed' },
];

const SORT_LABELS: Record<SortOption, string> = {
  alphabetical: 'Alfabetica',
  rating: 'Avaliacao',
  date_added: 'Data adicionada',
};

function sortBooks(books: Book[], sortBy: SortOption) {
  const nextBooks = [...books];

  if (sortBy === 'alphabetical') {
    return nextBooks.sort((left, right) => left.title.localeCompare(right.title, 'pt-BR'));
  }

  if (sortBy === 'rating') {
    return nextBooks.sort((left, right) => (right.rating ?? -1) - (left.rating ?? -1));
  }

  return nextBooks.sort(
    (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
  );
}

export function LibraryView() {
  const booksQuery = useBooks();
  const isConfigured = isSupabaseConfigured();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const query = searchParams.get('q') ?? '';
  const sortBy = (searchParams.get('sort') as SortOption | null) ?? 'date_added';
  const statusFilter = (searchParams.get('status') as StatusFilter | null) ?? 'all';
  const deferredQuery = useDeferredValue(query);
  const activeStatusLabel =
    STATUS_FILTERS.find((filter) => filter.value === statusFilter)?.label ?? 'Todos';
  const hasActiveFilters = Boolean(query.trim()) || statusFilter !== 'all';

  function updateParams(updates: Partial<Record<'q' | 'sort' | 'status', string>>) {
    const params = new URLSearchParams(searchParams.toString());
    const nextQuery = updates.q ?? query;
    const nextSort = updates.sort ?? sortBy;
    const nextStatus = updates.status ?? statusFilter;

    if (nextQuery.trim()) {
      params.set('q', nextQuery.trim());
    } else {
      params.delete('q');
    }

    if (nextSort === 'date_added') {
      params.delete('sort');
    } else {
      params.set('sort', nextSort);
    }

    if (nextStatus === 'all') {
      params.delete('status');
    } else {
      params.set('status', nextStatus);
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (nextUrl !== currentUrl) {
      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    }
  }

  if (booksQuery.isPending) {
    return (
      <PageContainer>
        <LoadingState
          title="Abrindo biblioteca"
          description="Buscando livros e preparando filtros para sua leitura."
          lines={4}
        />
      </PageContainer>
    );
  }

  if (booksQuery.isError) {
    return (
      <PageContainer>
        <EmptyState
          title="Nao foi possivel abrir biblioteca"
          description="Tente novamente para carregar seus livros."
          icon={<BookOpen className="size-5" />}
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => booksQuery.refetch()}
            >
              Tentar novamente
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const visibleBooks = sortBooks(
    (booksQuery.data ?? []).filter((book) => {
      const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
      const search = deferredQuery.trim().toLocaleLowerCase('pt-BR');
      const matchesQuery =
        search.length === 0 ||
        book.title.toLocaleLowerCase('pt-BR').includes(search) ||
        book.author.toLocaleLowerCase('pt-BR').includes(search);

      return matchesStatus && matchesQuery;
    }),
    sortBy
  );

  return (
    <PageContainer className="mx-auto w-full max-w-6xl gap-8">
      <section className="space-y-5">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="font-editorial text-4xl leading-none font-semibold tracking-[-0.04em] sm:text-5xl">
            Seus livros. Suas notas. Nada sobrando.
          </h1>

          {isConfigured ? <AddBookSheet /> : null}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Drawer open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <DrawerTrigger asChild>
            <Button type="button" variant="outline" className="rounded-full">
              <Search className="size-4" />
              Buscar e filtrar
            </Button>
          </DrawerTrigger>

          <DrawerContent className="px-0 pb-6">
            <DrawerHeader>
              <DrawerTitle className="font-editorial text-2xl tracking-[-0.03em]">
                Buscar livros
              </DrawerTitle>
              <DrawerDescription>
                Encontre um livro ou ajuste como a biblioteca aparece.
              </DrawerDescription>
            </DrawerHeader>

            <div className="space-y-5 px-4">
              <div className="space-y-2">
                <label htmlFor="library-search" className="text-sm font-medium">
                  Buscar livros
                </label>
                <Input
                  id="library-search"
                  value={query}
                  onChange={(event) => updateParams({ q: event.target.value })}
                  placeholder="Buscar livros"
                  className="bg-background h-11 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="library-sort" className="text-sm font-medium">
                  Ordenar por
                </label>
                <Select value={sortBy} onValueChange={(value) => updateParams({ sort: value })}>
                  <SelectTrigger id="library-sort" className="bg-background h-11 w-full rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetical">Alfabetica</SelectItem>
                    <SelectItem value="rating">Avaliacao</SelectItem>
                    <SelectItem value="date_added">Data adicionada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTERS.map((filter) => (
                    <Button
                      key={filter.value}
                      type="button"
                      variant={statusFilter === filter.value ? 'default' : 'outline'}
                      className="rounded-sm"
                      onClick={() => updateParams({ status: filter.value })}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <SlidersHorizontal className="size-3.5" />
            {SORT_LABELS[sortBy]}
          </span>
          <span>•</span>
          <span>{activeStatusLabel}</span>
          {query ? (
            <>
              <span>•</span>
              <span>“{query}”</span>
            </>
          ) : null}
        </div>
      </section>

      <section className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            {visibleBooks.length} {visibleBooks.length === 1 ? 'livro' : 'livros'}
          </p>
          <div className="text-muted-foreground hidden items-center gap-2 text-xs sm:flex">
            <ArrowDownAZ className="size-3.5" />
            <span>Toque em livro para abrir notas.</span>
          </div>
        </div>

        <BooksList
          books={visibleBooks}
          variant="compact"
          emptyTitle={
            hasActiveFilters ? 'Nenhum livro encontrado' : 'Sua biblioteca ainda esta vazia'
          }
          emptyDescription={
            hasActiveFilters
              ? 'Tente ajustar a busca ou os filtros para encontrar outro livro.'
              : 'Adicione o primeiro livro para transformar leitura em memória organizada.'
          }
        />
      </section>
    </PageContainer>
  );
}
