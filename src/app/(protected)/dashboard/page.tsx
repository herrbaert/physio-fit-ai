// src/app/(protected)/dashboard/page.tsx

// WICHTIG: Diese Datei hat KEIN 'use client'!
// Das bedeutet: Sie ist eine SERVER COMPONENT.
// Server Components können direkt auf die Datenbank zugreifen, ohne API Routes.

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ChatPanel from '@/components/ChatPanel';
import LogoutButton from '@/components/LogoutButton'; // Erstellen wir gleich

export default async function DashboardPage() {
  // SERVER-SIDE USER ABRUF
  // Wir nutzen den Server-Client, um den aktuell eingeloggten User zu holen
  const supabase = await createClient();
  
  // getUser() prüft die Session aus den Cookies
  const { data: { user }, error } = await supabase.auth.getUser();

  // FALLBACK: Falls die Middleware versagt hat (sollte nicht passieren)
  // Leiten wir manuell zum Login weiter
  if (error || !user) {
    redirect('/login');
  }

  // Ab hier wissen wir: User ist eingeloggt!
  // Wir können user.email, user.id, etc. nutzen

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      
      {/* LINKE SEITE: DASHBOARD (Hauptbereich) */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* HEADER MIT USER-INFO */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Physio-Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Willkommen zurück, <span className="font-semibold text-emerald-600">{user.email}</span>!
            </p>
          </div>
          
          {/* LOGOUT-BUTTON (Komponente erstellen wir gleich) */}
          <LogoutButton />
        </div>

        {/* USER-INFO CARD (Debug/Development) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            👤 Account-Informationen
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-600">User ID:</span>{' '}
              <span className="font-mono text-gray-800">{user.id}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">E-Mail:</span>{' '}
              <span className="text-gray-800">{user.email}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Registriert seit:</span>{' '}
              <span className="text-gray-800">
                {new Date(user.created_at || '').toLocaleDateString('de-DE')}
              </span>
            </p>
          </div>
        </div>

        {/* PLATZHALTER FÜR ZUKÜNFTIGE FEATURES */}
        <div className="mt-10 h-64 w-full bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-300 italic">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg">Schmerzverlauf Grafik (kommt bald)</p>
          </div>
        </div>
      </main>

      {/* RECHTE SEITE: CHAT-PANEL */}
      <ChatPanel />
    </div>
  );
}

// 🔐 WICHTIGE KONZEPTE:
// 
// 1. SERVER COMPONENTS (Default in Next.js App Router)
//    - Laufen auf dem Server, nicht im Browser
//    - Können direkt mit Datenbank kommunizieren (kein API-Endpunkt nötig)
//    - Sind "async" (können await nutzen)
//    - Haben Zugriff auf Cookies/Headers über next/headers
//
// 2. MIDDLEWARE + SERVER COMPONENT = Doppelter Schutz
//    - Middleware fängt Requests ab (schnell, lightweight)
//    - Server Component prüft nochmal (zusätzliche Sicherheit)
//
// 3. USER-OBJEKT
//    Das user-Objekt von Supabase enthält:
//    - id: Eindeutige UUID des Users
//    - email: Die registrierte E-Mail
//    - created_at: Zeitstempel der Registrierung
//    - user_metadata: Zusätzliche Daten (z.B. Name, Avatar)
