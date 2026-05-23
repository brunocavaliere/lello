import Image from 'next/image';

import { BookOpenText } from 'lucide-react';

import { cn } from '@/lib/utils';

type BookCoverProps = {
  alt: string;
  coverUrl?: string | null;
  className?: string;
  imageClassName?: string;
};

export function BookCover({ alt, coverUrl, className, imageClassName }: BookCoverProps) {
  if (!coverUrl) {
    return (
      <div
        className={cn(
          'bg-muted text-muted-foreground flex items-center justify-center overflow-hidden border',
          className
        )}
      >
        <BookOpenText className="size-4" />
      </div>
    );
  }

  return (
    <div className={cn('bg-muted relative overflow-hidden border', className)}>
      <Image
        src={coverUrl}
        alt={alt}
        fill
        sizes="(max-width: 768px) 64px, 96px"
        className={cn('object-cover', imageClassName)}
      />
    </div>
  );
}
