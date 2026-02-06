// src/app/(auth)/login/page.tsx
'use client';

// WICHTIG: Login-Logik läuft im Browser, daher 'use client'

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  // ROUTER: Zum Weiterleiten nach erfolgreichem Login
  const router = useRouter();
  
  // SEARCH PARAMS: Um die "redirect"-URL aus der URL zu lesen
  // (z.B. /login?redirect=/dashboard)
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // STATE: Formular-Daten
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // HANDLER: Login-Logik
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Verhindert Standard-Formular-Submit (Seiten-Reload)
    setLoading(true);
    setError(null);

    try {
      // Supabase-Client erstellen (Browser-Version)
      const supabase = createClient();
      
      // Login-Versuch
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Erfolg! Weiterleitung zur ursprünglichen Seite
      if (data.session) {
        router.push(redirectPath);
        router.refresh(); // Wichtig: Seite neu laden, damit Server die Session sieht
      }
    } catch (err: any) {
      setError(err.message || 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Physio-Fit-AI
          </h1>
          <p className="text-gray-400">
            Melde dich an, um fortzufahren
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* FORMULAR */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* EMAIL INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-Mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="deine@email.de"
            />
          </div>

          {/* PASSWORD INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Passwort
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-lg disabled:cursor-not-allowed"
          >
            {loading ? 'Anmeldung läuft...' : 'Anmelden'}
          </button>
        </form>

        {/* FOOTER LINK */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Noch kein Account?{' '}
          <a href="/signup" className="text-emerald-500 hover:text-emerald-400 font-medium">
            Jetzt registrieren
          </a>
        </p>
      </div>
    </div>
  );
}

// WAS HABEN WIR GELERNT?
// 1. Formular-Handling mit React (Controlled Components)
// 2. Async/Await für API-Calls (Supabase Auth)
// 3. Error-Handling und User-Feedback
// 4. Router-Navigation mit next/navigation
