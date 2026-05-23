'use client';

import { useEffect, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { BookInsert, BookStatus, BookUpdate } from '@/components/books/types';
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  getBooksForStatus,
  getCurrentBook,
  getRecentReflectionEntries,
  searchExternalBooks,
  updateBook,
} from '@/components/books/services';
import { queryKeys } from '@/lib/query-keys';

function useDebouncedValue(value: string, delay = 600) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay, value]);

  return debouncedValue;
}

export function useBooks(status?: BookStatus) {
  return useQuery({
    queryKey: status ? queryKeys.books.byStatus(status) : queryKeys.books.all(),
    queryFn: async () => (status ? getBooksForStatus(status) : getBooks()),
  });
}

export function useBook(id: string) {
  return useQuery({
    enabled: id.trim().length > 0,
    queryKey: queryKeys.books.detail(id),
    queryFn: async () => getBookById(id),
  });
}

export function useCurrentBook() {
  return useQuery({
    queryKey: queryKeys.books.current(),
    queryFn: async () => getCurrentBook(),
  });
}

export function useRecentReflections(limit = 3) {
  return useQuery({
    queryKey: queryKeys.books.reflections(limit),
    queryFn: async () => getRecentReflectionEntries(limit),
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: BookInsert) => createBook(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.books.all(),
      });
    },
  });
}

export function useUpdateBook(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: BookUpdate) => updateBook(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(id) });
    },
  });
}

export function useDeleteBook(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all() });
      queryClient.removeQueries({ queryKey: queryKeys.books.detail(id) });
    },
  });
}

export function useExternalBookSearch(query: string, enabled = true) {
  const debouncedQuery = useDebouncedValue(query.trim());

  return useQuery({
    enabled: enabled && debouncedQuery.length >= 3,
    queryKey: queryKeys.books.search(debouncedQuery),
    queryFn: async () => searchExternalBooks(debouncedQuery),
    staleTime: 1000 * 60 * 5,
  });
}
