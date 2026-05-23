import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { env } from '@/env';
import type { Database } from '@/lib/supabase/types';

const PUBLIC_AUTH_PATHS = new Set(['/login', '/signup']);
const PROTECTED_PATH_PREFIXES = ['/', '/books/'] as const;

function isProtectedPath(pathname: string) {
  if (pathname === '/') {
    return true;
  }

  return PROTECTED_PATH_PREFIXES.some((prefix) => prefix !== '/' && pathname.startsWith(prefix));
}

export async function updateSupabaseSession(request: NextRequest) {
  if (!env.isSupabaseEnabled) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const isAuthPath = PUBLIC_AUTH_PATHS.has(pathname);
  const isProtected = isProtectedPath(pathname);

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';

    if (pathname !== '/') {
      loginUrl.searchParams.set('next', `${pathname}${search}`);
    }

    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthPath) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = '/';
    homeUrl.search = '';
    return NextResponse.redirect(homeUrl);
  }

  return response;
}
