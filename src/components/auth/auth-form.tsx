'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';

import { useLoginForm, useSignupForm } from '@/components/auth/hooks/use-auth-forms';
import { signInWithEmail, signUpWithEmail } from '@/components/auth/services/auth-service';
import type { LoginFormValues, SignupFormValues } from '@/components/auth/types';
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
import { env } from '@/env';
import { showErrorToast, showInfoToast, showSuccessToast } from '@/lib/toast';

type AuthFormProps =
  | {
      mode: 'login';
    }
  | {
      mode: 'signup';
    };

function getNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith('/')) {
    return '/';
  }

  return nextPath;
}

function SharedDisabledNotice() {
  if (env.isSupabaseEnabled) {
    return null;
  }

  return (
    <p className="text-muted-foreground rounded-md border px-4 py-3 text-sm leading-6">
      Configure o Supabase para habilitar contas pessoais no Lello.
    </p>
  );
}

function LoginAuthForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const loginForm = useLoginForm();
  const nextPath = getNextPath(searchParams.get('next'));
  const isPending = loginForm.formState.isSubmitting;
  const isSupabaseEnabled = env.isSupabaseEnabled;

  async function handleLoginSubmit(values: LoginFormValues) {
    try {
      await signInWithEmail({
        email: values.email.trim(),
        password: values.password,
      });
      await queryClient.invalidateQueries();
      showSuccessToast('Entrada concluída.');
      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      showErrorToast('Não foi possível entrar.', {
        description: error instanceof Error ? error.message : 'Confira seu email e senha.',
      });
    }
  }

  return (
    <Form {...loginForm}>
      <form className="space-y-5" onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
        <SharedDisabledNotice />

        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  className="h-10 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="current-password"
                  className="h-10 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="h-10 w-full" disabled={!isSupabaseEnabled || isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Entrar
        </Button>
      </form>
    </Form>
  );
}

function SignupAuthForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const signupForm = useSignupForm();
  const isPending = signupForm.formState.isSubmitting;
  const isSupabaseEnabled = env.isSupabaseEnabled;

  async function handleSignupSubmit(values: SignupFormValues) {
    try {
      const result = await signUpWithEmail({
        email: values.email.trim(),
        password: values.password,
      });

      if (result.session) {
        await queryClient.invalidateQueries();
        showSuccessToast('Conta criada.');
        router.replace('/');
        router.refresh();
        return;
      }

      showInfoToast('Conta criada.', {
        description: 'Confira seu email para confirmar o acesso.',
      });
      router.replace('/login');
      router.refresh();
    } catch (error) {
      showErrorToast('Não foi possível criar a conta.', {
        description:
          error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
      });
    }
  }

  return (
    <Form {...signupForm}>
      <form className="space-y-5" onSubmit={signupForm.handleSubmit(handleSignupSubmit)}>
        <SharedDisabledNotice />

        <FormField
          control={signupForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  className="h-10 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={signupForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  className="h-10 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={signupForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  className="h-10 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="h-10 w-full" disabled={!isSupabaseEnabled || isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Criar conta
        </Button>
      </form>
    </Form>
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  if (mode === 'login') {
    return <LoginAuthForm />;
  }

  return <SignupAuthForm />;
}

export function AuthFooterLink({ mode }: AuthFormProps) {
  if (mode === 'login') {
    return (
      <p className="text-muted-foreground">
        Ainda não tenho conta.{' '}
        <Link
          href="/signup"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    );
  }

  return (
    <p className="text-muted-foreground">
      Já tenho uma conta.{' '}
      <Link
        href="/login"
        className="text-foreground font-medium underline-offset-4 hover:underline"
      >
        Entrar
      </Link>
    </p>
  );
}
