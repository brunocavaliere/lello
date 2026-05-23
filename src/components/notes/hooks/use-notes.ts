'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  AudioNoteInput,
  Note,
  TextNoteInput,
  UpdateTextNoteInput,
} from '@/components/notes/types';
import {
  createAudioNote,
  createTextNote,
  deleteNote,
  getNotesByBookId,
  updateTextNote,
} from '@/components/notes/services';
import { queryKeys } from '@/lib/query-keys';

export function useBookNotes(bookId: string) {
  return useQuery({
    enabled: bookId.trim().length > 0,
    queryKey: queryKeys.notes.byBook(bookId),
    queryFn: async () => getNotesByBookId(bookId),
  });
}

export function useCreateTextNote(bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TextNoteInput) => createTextNote(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.byBook(bookId) });
    },
  });
}

export function useCreateAudioNote(bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AudioNoteInput) => createAudioNote(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.byBook(bookId) });
    },
  });
}

export function useUpdateTextNote(bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateTextNoteInput) => updateTextNote(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.byBook(bookId) });
    },
  });
}

export function useDeleteNote(bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: Note) => deleteNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.byBook(bookId) });
    },
  });
}
