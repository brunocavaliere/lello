import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        'bg-card/85 border-border/80 rounded-[2rem] border border-dashed py-0 text-center shadow-none backdrop-blur',
        className
      )}
    >
      <CardHeader className={cn('items-center px-6 pt-8', action ? 'pb-0' : 'pb-8')}>
        {icon ? (
          <div className="bg-accent text-foreground mb-4 flex size-12 items-center justify-center rounded-2xl">
            {icon}
          </div>
        ) : null}
        <CardTitle className="font-serif text-xl tracking-tight">{title}</CardTitle>
        <p className="text-muted-foreground max-w-md text-sm leading-6">{description}</p>
      </CardHeader>
      {action ? (
        <CardContent className="flex justify-center pt-6 pb-8">{action}</CardContent>
      ) : null}
    </Card>
  );
}
