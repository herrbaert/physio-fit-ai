import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, MessageCircle, ShieldCheck, ArrowRight, LogIn } from 'lucide-react'; // Icons

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              P
            </div>
            <span className="text-lg font-bold tracking-tight">
              Physio-Fit-AI
            </span>
          </div>

          {/* NAV ACTIONS */}
          <nav className="flex items-center gap-2">
            {user ? (
              <Button asChild variant="default">
                <Link href="/dashboard">
                  Zum Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                {/* Ghost-Variant für den Login (weniger dominant) */}
                <Button asChild variant="ghost">
                  <Link href="/login">Anmelden</Link>
                </Button>
                {/* Default-Variant für die Hauptaktion */}
                <Button asChild>
                  <Link href="/signup">Registrieren</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-24 lg:py-32">
          
          <div className="flex max-w-[980px] flex-col items-start gap-4 mx-auto text-center md:items-center">
            
            {/* BADGE */}
            <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm rounded-full">
              <Activity className="mr-2 h-4 w-4 text-primary animate-pulse" />
              KI-Powered Physiotherapie v1.0
            </Badge>

            {/* HEADLINE */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              Schmerzfrei leben mit deinem <br className="hidden sm:inline" />
              <span className="text-primary bg-primary/10 px-2 rounded-lg -rotate-1 inline-block transform">
                KI-Coach
              </span>
            </h1>

            {/* SUBTITLE */}
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl md:mb-8">
              Dokumentiere deinen Schmerzverlauf, erhalte personalisierte Übungen und sprich jederzeit mit deinem intelligenten Assistenten.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col gap-4 sm:flex-row justify-center w-full">
              {user ? (
                <Button asChild size="lg" className="h-12 px-8 text-lg">
                  <Link href="/dashboard">
                    Dashboard öffnen <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="h-12 px-8 text-lg">
                  <Link href="/signup">
                    Jetzt kostenlos starten
                  </Link>
                </Button>
              )}
              
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg">
                <Link href="/about">
                  Mehr erfahren
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="container py-12 md:py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-950/50 rounded-3xl mb-24">
          <div className="grid gap-8 md:grid-cols-3">
            
            {/* Feature 1 */}
            <Card className="border-none shadow-md bg-background">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Activity className="h-6 w-6" />
                </div>
                <CardTitle>Schmerz-Tracking</CardTitle>
                <CardDescription>
                  Visualisiere deinen Fortschritt mit interaktiven Diagrammen und erkenne Muster.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-none shadow-md bg-background">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <CardTitle>KI-Assistent</CardTitle>
                <CardDescription>
                  Dein persönlicher Coach. Stelle Fragen zu Übungen und erhalte sofort Antworten.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-none shadow-md bg-background">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle>Sichere Daten</CardTitle>
                <CardDescription>
                  Deine Gesundheitsdaten gehören dir. Geschützt mit moderner Verschlüsselung.
                </CardDescription>
              </CardHeader>
            </Card>

          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Physio-Fit-AI. Built with Next.js & shadcn/ui.
          </p>
        </div>
      </footer>

    </div>
  );
}
