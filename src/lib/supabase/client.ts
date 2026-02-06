// src/lib/supabase/client.ts

// Dieser Client wird in Client Components (mit 'use client') verwendet.
// Er läuft im Browser und nutzt Browser-APIs wie Cookies.

import { createBrowserClient } from '@supabase/ssr';

// Die Funktion gibt uns einen konfigurierten Supabase-Client zurück.
// Wir kapseln das in eine Funktion, damit wir bei jedem Aufruf einen
// frischen Client bekommen (wichtig für Hot-Reloading in der Entwicklung).
export function createClient() {
  return createBrowserClient(
    // Die URL zu deiner Supabase-Instanz (aus .env.local)
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    
    // Der Anon-Key (Public Key, darf im Browser sein)
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// WARUM EINE FUNKTION STATT DIREKTEM EXPORT?
// In Next.js können Module mehrfach geladen werden (z.B. bei Hot Reload).
// Eine Funktion stellt sicher, dass wir immer mit einem frischen,
// aktuellen Client arbeiten, der die neuesten Umgebungsvariablen nutzt.
