import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ action, className, description, icon, title }: EmptyStateProps) {
  return (
    <Card
      className={cn(
        'bg-card/85 border-border/80 flex flex-col justify-center border border-dashed py-0 text-center shadow-none backdrop-blur',
        className
      )}
    >
      <CardHeader className={cn('flex flex-col items-center gap-4 p-8', action ? 'pb-0' : 'pb-8')}>
        {icon ? (
          <div className="bg-accent text-foreground flex size-12 items-center justify-center rounded-2xl">
            {icon}
          </div>
        ) : null}
        <CardTitle className="font-serif text-xl tracking-tight">{title}</CardTitle>
        <CardDescription className="mx-auto max-w-md text-center text-sm leading-7">
          {description}
        </CardDescription>
      </CardHeader>
      {action ? (
        <CardContent className="flex justify-center pt-6 pb-8">{action}</CardContent>
      ) : null}
    </Card>
  );
}
