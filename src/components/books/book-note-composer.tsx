'use client';

import { useState } from 'react';

import { Image as ImageIcon, Mic, NotebookPen, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { showInfoToast } from '@/lib/toast';

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
  {
    key: 'image',
    label: 'Imagem',
    description: 'Guarde uma foto de página, trecho ou anotação.',
    icon: ImageIcon,
  },
] as const;

type BookNoteComposerProps = {
  onSelectTextNote: () => void;
  onSelectAudioNote: () => void;
};

export function BookNoteComposer({ onSelectAudioNote, onSelectTextNote }: BookNoteComposerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          size="icon"
          className="fixed right-4 bottom-5 z-40 size-14 rounded-full shadow-lg sm:right-6 sm:bottom-6"
          aria-label="Nova nota"
        >
          <Plus className="size-5" />
          <span className="sr-only">Nova nota</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-[50dvh] max-h-[50dvh] px-0 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <DrawerHeader className="gap-3 px-5 pt-6 pb-4 sm:px-6">
          <DrawerTitle className="font-editorial text-2xl tracking-[-0.03em]">
            Nova nota
          </DrawerTitle>
          <DrawerDescription className="max-w-sm text-sm leading-6">
            Escolha como quer registrar este momento de leitura.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 space-y-2 px-3 sm:px-4">
          {NOTE_ACTIONS.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.label}
                type="button"
                variant="ghost"
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
                    return;
                  }

                  setIsOpen(false);
                  showInfoToast(action.label, {
                    description: 'Fluxo de criação chega no próximo passo.',
                  });
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-full">
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
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
      </DrawerContent>
    </Drawer>
  );
}
