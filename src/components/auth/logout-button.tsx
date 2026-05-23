'use client';

import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';

import { signOutUser } from '@/components/auth/services/auth-service';
import { Button } from '@/components/ui/button';
import { showErrorToast } from '@/lib/toast';

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    try {
      await signOutUser();
      queryClient.clear();
      router.replace('/login');
      router.refresh();
    } catch (error) {
      showErrorToast('Não foi possível sair.', {
        description:
          error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
      });
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="gap-1.5"
      onClick={() => void handleSignOut()}
    >
      <LogOut className="size-4" />
      <span className="hidden sm:inline">Sair</span>
    </Button>
  );
}
