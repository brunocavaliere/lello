'use client';

import { useState } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

type BookDescriptionPreviewProps = {
  description: string;
  title: string;
};

export function BookDescriptionPreview({ description, title }: BookDescriptionPreviewProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground block max-h-14 w-full max-w-3xl min-w-0 overflow-hidden text-left text-sm leading-7 transition-colors"
        onClick={() => setOpen(true)}
      >
        <span
          className="block overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {description}
        </span>
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="h-[70dvh] md:max-w-lg">
          <DrawerHeader className="border-border/70 border-b px-6 py-5">
            <DrawerTitle className="font-editorial text-3xl tracking-[-0.03em]">
              {title}
            </DrawerTitle>
            <DrawerDescription className="line-clamp-1">Descrição do livro</DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto px-6 py-6">
            <p className="text-muted-foreground text-sm leading-7 whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
