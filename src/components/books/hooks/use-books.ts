'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { BookInsert, BookStatus } from '@/components/books/types';
import {
  createBook,
  getBookById,
  getBooks,
  getBooksForStatus,
  getCurrentBook,
  getRecentReflectionEntries,
} from '@/components/books/services';
import { queryKeys } from '@/lib/query-keys';

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
