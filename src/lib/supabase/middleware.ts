// src/lib/supabase/middleware.ts

// Diese Funktion wird in der Next.js Middleware aufgerufen (bei JEDEM Request).
// Sie prüft, ob die Session noch gültig ist, und aktualisiert sie bei Bedarf.

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Wir erstellen eine Response, die wir später zurückgeben.
  // Anfangs ist das nur eine "Weiterleitung" zur nächsten Route.
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Jetzt erstellen wir einen Supabase-Client für die Middleware.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Cookies aus dem Request lesen
        getAll() {
          return request.cookies.getAll();
        },
        
        // Neue Cookies in die Response schreiben
        setAll(cookiesToSet) {
          // Wir setzen sie sowohl im Request (für spätere Middleware)...
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          
          // ...als auch in der Response (damit der Browser sie bekommt).
          supabaseResponse = NextResponse.next({
            request,
          });
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // WICHTIG: Hier fordern wir den User ab.
  // Das triggert intern bei Supabase ein Token-Refresh, falls nötig.
  // Auch wenn wir den User hier nicht nutzen, ist dieser Aufruf wichtig!
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ROUTE PROTECTION (Zugriffskontrolle)
  // Hier definieren wir, welche Seiten nur für eingeloggte User sind.
  const protectedRoutes = ['/dashboard'];
  const pathname = request.nextUrl.pathname;
  
  // Prüfen: Ist der Nutzer auf einer geschützten Seite?
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Falls ja und NICHT eingeloggt: Weiterleitung zum Login
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Wir merken uns die ursprüngliche URL, um nach Login dorthin zurückzukehren
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Ansonsten: Alles gut, Request durchlassen
  return supabaseResponse;
}

// WAS PASSIERT HIER?
// 1. User besucht eine Seite (z.B. /dashboard)
// 2. Diese Funktion wird ZUERST ausgeführt (vor der Seite selbst)
// 3. Wir prüfen die Session und refreshen sie bei Bedarf
// 4. Wenn alles OK ist, lassen wir den Request durch
// 5. Wenn nicht eingeloggt: Umleitung zu /login
