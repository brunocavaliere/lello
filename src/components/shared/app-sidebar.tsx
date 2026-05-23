'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { ComponentType } from 'react';

import { BookMarked, ListTodo } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type AppSidebarItem = {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  isActive?: boolean;
};

type AppSidebarProps = {
  items?: AppSidebarItem[];
};

const DEFAULT_ITEMS: AppSidebarItem[] = [
  {
    label: 'Biblioteca',
    href: '/library',
    icon: BookMarked,
  },
  {
    label: 'Fila de leitura',
    href: '/reading-queue',
    icon: ListTodo,
  },
];

export function AppSidebar({ items = DEFAULT_ITEMS }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-0 flex-col bg-transparent">
      <div className="flex items-center gap-3 px-5 py-6">
        <Avatar size="lg" className="bg-foreground text-background rounded-2xl">
          <AvatarFallback className="text-background bg-transparent font-semibold">
            LE
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <Link href="/" className="truncate text-sm font-semibold tracking-tight">
            Lello
          </Link>
          <p className="text-muted-foreground text-xs">memoria de leitura</p>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.isActive ??
              (item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`));

            return (
              <li key={item.label}>
                <Button
                  asChild
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'h-auto w-full justify-start gap-3 rounded-2xl px-3 py-2.5 text-sm shadow-none',
                    isActive && 'bg-secondary/80 text-foreground'
                  )}
                >
                  <Link href={item.href}>
                    {Icon ? <Icon className="size-4" /> : null}
                    <span>{item.label}</span>
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
