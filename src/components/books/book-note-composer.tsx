'use client';

import { useEffect, useState } from 'react';

import { Mic, NotebookPen, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const NOTE_ACTIONS = [
  {
    key: 'text',
    label: 'Nota escrita',
    description: 'Registre uma ideia, resumo ou reflexão.',
    icon: NotebookPen,
  },
  {
    key: 'audio',
    label: 'Áudio',
    description: 'Dite uma nota rapidamente.',
    icon: Mic,
  },
] as const;

type BookNoteComposerProps = {
  onSelectTextNote: () => void;
  onSelectAudioNote: () => void;
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    function handleChange() {
      setIsDesktop(mediaQuery.matches);
    }

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isDesktop;
}

export function BookNoteComposer({ onSelectAudioNote, onSelectTextNote }: BookNoteComposerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const trigger = (
    <Button
      type="button"
      size="icon"
      className="fixed right-4 bottom-5 z-40 size-14 rounded-full shadow-lg sm:right-6 sm:bottom-6"
      aria-label="Nova nota"
    >
      <Plus className="size-5" />
      <span className="sr-only">Nova nota</span>
    </Button>
  );

  const content = (
    <>
      <div className="mb-10 px-5 sm:px-6">
        {isDesktop ? (
          <SheetHeader className="gap-1 px-0 pt-6 pb-0">
            <SheetTitle className="font-editorial text-2xl tracking-[-0.03em]">
              Nova nota
            </SheetTitle>
            <SheetDescription className="max-w-sm text-sm leading-6">
              Escolha como quer registrar este momento de leitura.
            </SheetDescription>
          </SheetHeader>
        ) : (
          <DrawerHeader className="gap-1 px-0">
            <DrawerTitle className="font-editorial text-2xl tracking-[-0.03em]">
              Nova nota
            </DrawerTitle>
            <DrawerDescription className="max-w-sm text-sm leading-6">
              Escolha como quer registrar este momento de leitura.
            </DrawerDescription>
          </DrawerHeader>
        )}
      </div>

      <div className="flex-1 space-y-4 px-3 sm:px-4">
        {NOTE_ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.label}
              type="button"
              variant="outline"
              className="h-auto w-full justify-start rounded-[1.35rem] px-4 py-4 text-left"
              onClick={() => {
                if (action.key === 'text') {
                  setIsOpen(false);
                  onSelectTextNote();
                  return;
                }

                if (action.key === 'audio') {
                  setIsOpen(false);
                  onSelectAudioNote();
                }
              }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate">{action.label}</p>
                  <p className="text-muted-foreground text-sm leading-6 break-words whitespace-normal">
                    {action.description}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>

        <SheetContent className="h-[100dvh] max-h-[100dvh] w-full gap-0 px-0 pb-0 sm:max-w-xl">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="h-[50dvh] max-h-[50dvh] px-0 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        {content}
      </DrawerContent>
    </Drawer>
  );
}
