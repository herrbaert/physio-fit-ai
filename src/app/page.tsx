// 1. CLIENT DIRECTIVE
// In Next.js gibt es "Server Components" und "Client Components".
// Da wir später Interaktionen (Klicks, Tippen) im Chat brauchen, 
// sagen wir mit diesem Befehl: "Dieser Teil wird im Browser des Users ausgeführt".
'use client';

// 2. DIE KOMPONENTE
// In React ist jede Funktion, die HTML-ähnlichen Code (JSX) zurückgibt, eine Komponente.
// "export default" bedeutet: Das ist die Haupt-Sache in dieser Datei.
export default function Home() {
  
  // 3. DAS RENDER-ERGEBNIS (JSX)
  // Alles innerhalb von "return" ist das, was du am Ende im Browser siehst.
  return (
    /* CONTAINER: Wir nutzen Flexbox (flex), um die Seite aufzuteilen.
       - h-screen: Nutze 100% der Bildschirmhöhe.
       - bg-gray-100: Ein ganz helles Grau als Hintergrund.
    */
    <div className="flex h-screen bg-gray-100">
      
      {/* A: DER HAUPTBEREICH (Dashboard)
          - flex-1: Dieser Teil nimmt allen verfügbaren Platz ein, der übrig bleibt.
          - p-10: Padding (Abstand nach innen) von 10 Einheiten.
      */}
      <div className="flex-1 p-10">
        {/* text-4xl: Riesige Schrift | font-bold: Fett | text-gray-800: Dunkelgrau */}
        <h1 className="text-4xl font-bold text-gray-800">Mein Physio-Dashboard</h1>
        {/* mt-4: Margin-Top (Abstand nach oben) von 4 Einheiten */}
        <p className="mt-4 text-gray-600">Hier kommen später meine Schmerzkurven hin.</p>
      </div>

      {/* B: DAS CHAT-PANEL (Rechte Seite)
          - w-96: Eine feste Breite (ca. 384px), damit der Chat stabil bleibt.
          - bg-white: Hintergrund Weiß (Material Design Look).
          - border-l: Ein feiner Rahmen nur auf der linken Seite zur Abgrenzung.
          - shadow-xl: Ein starker Schatten, damit es "über" dem Dashboard zu schweben scheint.
      */}
      <div className="w-96 bg-white border-l border-gray-200 p-6 shadow-xl flex flex-col">
        
        {/* Überschrift des Chats */}
        <h2 className="text-xl font-semibold mb-4 text-emerald-600">Physio-Coach</h2>
        
        {/* CHAT-VERLAUF (Platzhalter)
            - h-[500px]: Feste Höhe für den Moment.
            - bg-gray-50: Minimal dunkler als Weiß.
            - border-dashed: Ein gestrichelter Rahmen (sieht man oft bei Platzhaltern).
            - flex items-center justify-center: Zentriert den Text genau in der Mitte.
        */}
        <div className="h-[500px] bg-gray-50 rounded-lg mb-4 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
          Chat-Verlauf kommt hierher...
        </div>

        {/* EINGABEFELD
            - focus:ring-2: Wenn man reinklickt, erscheint ein schöner grüner Ring.
            - outline-none: Entfernt den hässlichen Standard-Rahmen vom Browser.
            - transition-all: Macht Effekte (wie das Leuchten beim Klicken) geschmeidig.
        */}
        <input 
          type="text" 
          placeholder="Schreib dem Coach..." 
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
        />
      </div>
      
    </div>
  );
}