// src/components/LogoutButton.tsx
'use client';

// Der Logout muss im Browser passieren, daher 'use client'

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      
      // signOut() löscht die Session (sowohl lokal als auch auf dem Server)
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      // Nach erfolgreichem Logout: Weiterleitung zur Login-Seite
      router.push('/login');
      router.refresh(); // Server-Komponenten neu laden
      
    } catch (error) {
      console.error('Logout fehlgeschlagen:', error);
      alert('Logout fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Abmeldung...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Abmelden
        </>
      )}
    </button>
  );
}

// 🔓 LOGOUT FLOW:
// 1. User klickt "Abmelden"
// 2. supabase.auth.signOut() wird aufgerufen
// 3. Supabase löscht die Session-Cookies
// 4. Router leitet zu /login weiter
// 5. Middleware erkennt: Keine Session → User bleibt auf /login
