// src/lib/supabase/server.ts

// Dieser Client wird in Server Components, API Routes und Server Actions verwendet.
// Er hat Zugriff auf die Request-Cookies und kann sie lesen/schreiben.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  // Wir müssen die Cookies vom Request holen.
  // Next.js 15+ erfordert, dass wir cookies() awaiten.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // GETTER: Wie lesen wir alle Cookies?
        // Wir geben ein Array von Cookie-Objekten zurück.
        getAll() {
          return cookieStore.getAll();
        },
        
        // SETTER: Wie setzen wir Cookies?
        // Diese Funktion wird von Supabase aufgerufen, wenn neue Cookies
        // gespeichert werden müssen (z.B. nach Login oder Token-Refresh).
        setAll(cookiesToSet) {
          try {
            // Für jedes Cookie, das Supabase setzen will...
            cookiesToSet.forEach(({ name, value, options }) => 
              cookieStore.set(name, value, options)
            );
          } catch {
            // WICHTIGER HINWEIS:
            // In Server Components können wir Cookies nicht setzen
            // (weil die Antwort schon "rendered" wurde).
            // Das ist OK! Die Middleware kümmert sich um Session-Updates.
            // Deshalb fangen wir den Fehler hier ab und ignorieren ihn.
          }
        },
      },
    }
  );
}

// WARUM IST DAS SO KOMPLIZIERT?
// Cookies sind sensibel. Supabase muss die Session-Tokens (JWTs) in Cookies
// speichern, damit sie sicher sind (HTTP-Only Cookies können nicht von
// JavaScript im Browser geklaut werden = Schutz vor XSS-Attacken).
// Dieser Code gibt Supabase die "Erlaubnis", Cookies zu lesen und zu setzen.
