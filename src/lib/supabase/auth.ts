import type { User } from '@supabase/supabase-js';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getServerUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireServerUser() {
  const user = await getServerUser();

  if (!user) {
    return null satisfies User | null;
  }

  return user;
}
