export const queryKeys = {
  books: {
    all: () => ['books'] as const,
    byStatus: (status: string) => ['books', 'status', status] as const,
    current: () => ['books', 'current'] as const,
    detail: (id: string) => ['books', 'detail', id] as const,
    reflections: (limit: number) => ['books', 'reflections', limit] as const,
    search: (query: string) => ['books', 'search', query] as const,
  },
  notes: {
    byBook: (bookId: string) => ['notes', 'book', bookId] as const,
  },
  example: {
    all: ['example'] as const,
    detail: (id: string | number) => ['example', 'detail', id] as const,
    metrics: () => ['example', 'metrics'] as const,
  },
} as const;
