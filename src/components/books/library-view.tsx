'use client';

import { startTransition, useDeferredValue, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowDownAZ,
  BookOpen,
  Check,
  Clock3,
  ListTodo,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

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
type LibraryViewProps = {
  scope?: StatusFilter;
};

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

export function LibraryView({ scope = 'all' }: LibraryViewProps) {
  const booksQuery = useBooks();
  const isConfigured = isSupabaseConfigured();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const query = searchParams.get('q') ?? '';
  const sortBy = (searchParams.get('sort') as SortOption | null) ?? 'date_added';
  const statusFilter = (searchParams.get('status') as StatusFilter | null) ?? 'all';
  const effectiveStatus = scope === 'all' ? statusFilter : scope;
  const yearFilter = searchParams.get('year') ?? 'all';
  const deferredQuery = useDeferredValue(query);
  const activeStatusLabel =
    STATUS_FILTERS.find((filter) => filter.value === effectiveStatus)?.label ?? 'Todos';
  const hasActiveFilters =
    Boolean(query.trim()) || effectiveStatus !== 'all' || yearFilter !== 'all';

  function updateParams(updates: Partial<Record<'q' | 'sort' | 'status' | 'year', string>>) {
    const params = new URLSearchParams(searchParams.toString());
    const nextQuery = updates.q ?? query;
    const nextSort = updates.sort ?? sortBy;
    const nextStatus = updates.status ?? statusFilter;
    const nextYear = updates.year ?? yearFilter;

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

    if (nextYear === 'all') {
      params.delete('year');
    } else {
      params.set('year', nextYear);
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

  const allBooks = booksQuery.data ?? [];
  const availableYears = Array.from(
    new Set(
      allBooks
        .filter((book) => book.status === 'completed' && book.completed_at)
        .map((book) => new Date(book.completed_at as string).getFullYear().toString())
    )
  ).sort((left, right) => Number(right) - Number(left));
  const visibleBooks = sortBooks(
    allBooks.filter((book) => {
      const matchesStatus = effectiveStatus === 'all' || book.status === effectiveStatus;
      const matchesYear =
        yearFilter === 'all' ||
        (book.completed_at && new Date(book.completed_at).getFullYear().toString() === yearFilter);
      const search = deferredQuery.trim().toLocaleLowerCase('pt-BR');
      const matchesQuery =
        search.length === 0 ||
        book.title.toLocaleLowerCase('pt-BR').includes(search) ||
        book.author.toLocaleLowerCase('pt-BR').includes(search);

      return matchesStatus && matchesYear && matchesQuery;
    }),
    sortBy
  );

  return (
    <PageContainer className="mx-auto w-full max-w-6xl gap-8">
      <section className="space-y-5">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Sua biblioteca pessoal
            </p>
            <h1 className="font-editorial text-4xl leading-none font-semibold tracking-[-0.04em] sm:text-5xl">
              Seus livros. Seu ritmo.
            </h1>
            <p className="text-muted-foreground max-w-xl leading-7">
              Um lugar simples para saber o que você quer ler, está lendo e já terminou.
            </p>
          </div>

          {isConfigured ? <AddBookSheet /> : null}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumo da biblioteca">
        {[
          {
            href: '/reading-queue',
            label: 'Quero ler',
            description: 'Sua próxima leitura',
            icon: ListTodo,
            status: 'want_to_read' as const,
          },
          {
            href: '/?status=reading',
            label: 'Estou lendo',
            description: 'Leituras em andamento',
            icon: Clock3,
            status: 'reading' as const,
          },
          {
            href: '/?status=completed',
            label: 'Já li',
            description: 'Seu histórico de leitura',
            icon: Check,
            status: 'completed' as const,
          },
        ].map((item) => {
          const Icon = item.icon;
          const count = allBooks.filter((book) => book.status === item.status).length;

          return (
            <Link
              key={item.status}
              href={item.href}
              className="bg-card/75 hover:bg-card border-border/70 rounded-xl border p-4 transition-colors"
            >
              <div className="mb-5 flex items-center justify-between">
                <Icon className="text-muted-foreground size-4" />
                <span className="font-editorial text-3xl font-semibold">{count}</span>
              </div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-muted-foreground mt-1 text-xs">{item.description}</p>
            </Link>
          );
        })}
      </section>

      <nav
        className="border-border/70 flex gap-1 overflow-x-auto border-b pb-1"
        aria-label="Biblioteca"
      >
        {[
          { href: '/library', label: 'Todos', value: 'all' as const },
          { href: '/reading-queue', label: 'Quero ler', value: 'want_to_read' as const },
          { href: '/?status=reading', label: 'Estou lendo', value: 'reading' as const },
          { href: '/?status=completed', label: 'Já li', value: 'completed' as const },
        ].map((item) => (
          <Button
            key={item.value}
            asChild
            variant={effectiveStatus === item.value ? 'secondary' : 'ghost'}
            className="shrink-0 rounded-lg"
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </nav>

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

              {scope === 'all' ? (
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
              ) : null}

              <div className="space-y-2">
                <label htmlFor="library-year" className="text-sm font-medium">
                  Ano de conclusão
                </label>
                <Select value={yearFilter} onValueChange={(value) => updateParams({ year: value })}>
                  <SelectTrigger id="library-year" className="bg-background h-11 w-full rounded-lg">
                    <SelectValue placeholder="Todos os anos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os anos</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          {yearFilter !== 'all' ? (
            <>
              <span>•</span>
              <span>Concluídos em {yearFilter}</span>
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
            <span>Toque em um livro para abrir seus detalhes.</span>
          </div>
        </div>

        <BooksList
          books={visibleBooks}
          layout="grid"
          variant="grid"
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
