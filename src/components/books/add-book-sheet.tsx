'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { BOOK_STATUS_OPTIONS } from '@/components/books/constants';
import { createBookSchema } from '@/components/books/schemas';
import { useCreateBook } from '@/components/books/hooks';
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

type CreateBookValues = z.infer<typeof createBookSchema>;
type CreateBookInputValues = z.input<typeof createBookSchema>;

type AddBookSheetProps = {
  triggerLabel?: string;
};

export function AddBookSheet({ triggerLabel = 'Adicionar livro' }: AddBookSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const createBook = useCreateBook();

  const form = useForm<CreateBookInputValues, undefined, CreateBookValues>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: '',
      author: '',
      status: 'want_to_read',
    },
  });

  async function handleSubmit(values: CreateBookValues) {
    const loadingToastId = showLoadingToast('Salvando livro...', {
      description: 'Enviando dados para sua biblioteca.',
    });

    try {
      await createBook.mutateAsync({
        author: values.author,
        status: values.status,
        title: values.title,
      });

      showSuccessToast('Livro adicionado.', {
        description: 'Sua biblioteca foi atualizada com sucesso.',
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      showErrorToast('Nao foi possivel salvar o livro.', {
        description:
          error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
      });
    } finally {
      dismissToast(loadingToastId);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="rounded-full">
          <BookPlus className="size-4" />
          {triggerLabel}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full gap-0 sm:max-w-lg">
        <SheetHeader className="border-border/70 border-b px-6 py-5">
          <SheetTitle className="font-editorial text-3xl tracking-[-0.03em]">Novo livro</SheetTitle>
          <SheetDescription>
            Adicione o essencial agora. Voce pode enriquecer o contexto do livro depois.
          </SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto px-6 py-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => handleSubmit(values))}
              className="space-y-5"
              noValidate
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titulo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Deep Work" {...field} />
                    </FormControl>
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
                className="w-full rounded-full"
                disabled={form.formState.isSubmitting || createBook.isPending}
              >
                {createBook.isPending ? 'Salvando...' : 'Salvar livro'}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
