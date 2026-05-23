import type { SupabaseClient, User } from '@supabase/supabase-js';

import type { Database } from '@/lib/supabase/types';

export async function requireAuthenticatedUser(supabase: SupabaseClient<Database>): Promise<User> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error('Sua sessão expirou. Entre novamente para continuar.');
  }

  return user;
}
