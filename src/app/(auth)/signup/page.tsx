// src/app/(auth)/signup/page.tsx
'use client';

// Diese Seite ermöglicht neuen Nutzern die Registrierung.
// Sie ist sehr ähnlich zur Login-Seite, nutzt aber signUp() statt signInWithPassword().

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  // ROUTER: Zum Weiterleiten nach erfolgreicher Registrierung
  const router = useRouter();

  // STATE: Formular-Daten
  // Wir brauchen Email, Passwort und eine Passwort-Bestätigung
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // STATE: UI-Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // HANDLER: Registrierungs-Logik
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Verhindert Seiten-Reload beim Submit
    setLoading(true);
    setError(null);
    setSuccess(false);

    // VALIDIERUNG: Passwörter müssen übereinstimmen
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      setLoading(false);
      return; // Abbruch, bevor wir Supabase kontaktieren
    }

    // VALIDIERUNG: Passwort-Länge (Supabase-Standard: min. 6 Zeichen)
    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein');
      setLoading(false);
      return;
    }

    try {
      // Supabase-Client erstellen (Browser-Version)
      const supabase = createClient();
      
      // REGISTRIERUNGS-VERSUCH
      // signUp() erstellt einen neuen User in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // WICHTIG: emailRedirectTo definiert, wohin der Bestätigungs-Link führt
          // (falls du Email-Bestätigung aktiviert hast in Supabase Settings)
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // ERFOLG!
      // WICHTIG: Je nach Supabase-Konfiguration gibt es zwei Szenarien:
      // 1. Email-Bestätigung DEAKTIVIERT: User ist sofort eingeloggt (data.session existiert)
      // 2. Email-Bestätigung AKTIVIERT: User bekommt Email, data.session ist null
      
      if (data.session) {
        // Szenario 1: Direkter Login
        router.push('/dashboard');
        router.refresh(); // Server-Komponenten neu laden
      } else {
        // Szenario 2: Bestätigungs-Email wurde verschickt
        setSuccess(true);
      }

    } catch (err: any) {
      // Fehlerbehandlung
      // Häufige Fehler: "User already registered", "Invalid email", etc.
      setError(err.message || 'Registrierung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  // FALL: Bestätigungs-Email wurde verschickt
  // Wir zeigen eine andere UI, damit der User weiß, was zu tun ist
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 text-center">
          
          {/* SUCCESS ICON */}
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            Fast geschafft!
          </h2>
          
          <p className="text-gray-300 mb-6">
            Wir haben dir eine Bestätigungs-Email an <strong className="text-emerald-400">{email}</strong> geschickt.
            Bitte klicke auf den Link in der Email, um dein Konto zu aktivieren.
          </p>

          <a 
            href="/login" 
            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            Zurück zum Login
          </a>
        </div>
      </div>
    );
  }

  // STANDARD-FORMULAR
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Account erstellen
          </h1>
          <p className="text-gray-400">
            Starte deine Physio-Reise
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* FORMULAR */}
        <form onSubmit={handleSignup} className="space-y-5">
          
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
              placeholder="Mindestens 6 Zeichen"
            />
          </div>

          {/* CONFIRM PASSWORD INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Passwort bestätigen
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="Passwort wiederholen"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-lg disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Registrierung läuft...' : 'Account erstellen'}
          </button>
        </form>

        {/* FOOTER LINK */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Hast du bereits einen Account?{' '}
          <a href="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
            Jetzt anmelden
          </a>
        </p>
      </div>
    </div>
  );
}

// 📚 WAS HABEN WIR GELERNT?
// 1. CLIENT-SIDE VALIDIERUNG: Wir prüfen Passwörter, BEVOR wir Supabase kontaktieren
//    (spart Netzwerk-Anfragen und gibt schnelleres Feedback)
// 2. CONDITIONAL RENDERING: Wir zeigen unterschiedliche UIs je nach Sta
