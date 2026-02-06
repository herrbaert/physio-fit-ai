// src/middleware.ts (oder /middleware.ts falls du keinen src-Ordner hast)

// Diese Datei ist der "Türsteher" deiner App.
// Sie wird bei JEDEM Request ausgeführt, BEVOR die eigentliche Seite geladen wird.

import { updateSession } from '@/lib/supabase/middleware';
import type { NextRequest } from 'next/server';

// Die Hauptfunktion, die Next.js automatisch aufruft
export async function middleware(request: NextRequest) {
  // Wir delegieren die ganze Arbeit an unsere updateSession-Funktion
  return await updateSession(request);
}

// CONFIG: Wann soll diese Middleware laufen?
export const config = {
  // matcher: Ein Pattern, das definiert, bei welchen URLs die Middleware läuft
  matcher: [
    // WICHTIG: Wir schließen Next.js interne Pfade aus!
    // '/((?!_next|api|favicon.ico|.*\\.).*)'
    // Bedeutet: "Alle Pfade AUSSER die mit _next, api, favicon.ico oder einer Dateiendung"
    
    // Einfacher Matcher (empfohlen):
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// WARUM DIESE EXCLUDE-REGEL?
// Wir wollen die Middleware NICHT bei statischen Assets (Bilder, CSS, etc.)
// oder Next.js internen Routes (_next/) ausführen.
// Das würde nur Performance kosten und ist unnötig.
