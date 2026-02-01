// Auch hier brauchen wir 'use client', da wir eine Client-Komponente (ChatPanel) einbinden.
'use client';

// IMPORT-ANWEISUNG: 
// Hier sagen wir React: "Geh in den Ordner components und lade die Funktion ChatPanel".
// Das "@" ist ein Alias (Spitzname), der direkt zum "src"-Ordner führt.
import ChatPanel from '@/components/ChatPanel';

export default function Home() {
  return (
    /* DER HAUPT-CONTAINER DER GESAMTEN SEITE
       - flex: Ordnet Dashboard (links) und Chat (rechts) nebeneinander an.
       - h-screen: Die Seite ist exakt so hoch wie der Bildschirm.
       - bg-gray-100: Ein sehr helles Grau für das gesamte Dashboard im Hintergrund.
    */
    <div className="flex h-screen bg-gray-100">
      
      {/* LINKER BEREICH: DAS DASHBOARD 
          - flex-1: Dieses Div "atmet" und nimmt allen Platz ein, den der Chat rechts übrig lässt.
          - p-10: Großzügiger Abstand zum Rand (10 Einheiten).
      */}
      <div className="flex-1 p-10">
        {/* Hauptüberschrift: Groß (4xl), Fett (bold), Dunkelgrau (800) */}
        <h1 className="text-4xl font-bold text-gray-800">Mein Physio-Dashboard</h1>
        
        {/* Untertitel: Kleiner Abstand oben (mt-4), normales Grau (600) */}
        <p className="mt-4 text-gray-600">Hier kommen später meine Schmerzkurven hin.</p>
        
        {/* PLATZHALTER FÜR DIE GRAFIK
            - mt-10: 10 Einheiten Abstand nach oben zum Text.
            - h-64: Eine feste Höhe von 64 Einheiten (ca. 256px).
            - w-full: Volle Breite des Dashboards.
            - bg-white: Die Karte selbst ist weiß (Material Style).
            - rounded-2xl: Sehr stark abgerundete Ecken für einen modernen Look.
            - shadow-sm: Ein ganz dezenter Schatten.
            - border border-gray-200: Ein feiner Rahmen.
            - flex items-center justify-center: Zentriert den Platzhalter-Text.
            - text-gray-300: Sehr heller Text, da es nur ein Platzhalter ist.
        */}
        <div className="mt-10 h-64 w-full bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-300">
          Schmerzkurve Grafik (Modul 3)
        </div>
      </div>

      {/* RECHTER BEREICH: UNSERE NEUE KOMPONENTE
          Statt hier wieder 30 Zeilen Chat-Code zu schreiben, schreiben wir nur <ChatPanel />.
          React fügt an dieser Stelle automatisch alles ein, was in der ChatPanel.tsx steht.
      */}
      <ChatPanel />
      
    </div>
  );
}