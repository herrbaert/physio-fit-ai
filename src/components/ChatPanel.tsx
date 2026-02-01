// Diese Zeile muss immer ganz oben stehen, wenn die Komponente interaktiv ist.
// Sie sagt Next.js: "Dieser Code braucht JavaScript im Browser (für Klicks, Tippen etc.)".
'use client';

// Hier definieren wir die Funktion "ChatPanel". 
// "export default" erlaubt es uns, diese Funktion in anderen Dateien (wie page.tsx) zu benutzen.
export default function ChatPanel() {
  return (
    /* DER HAUPT-CONTAINER DES CHATS
       - w-96: Breite von 96 Einheiten (ca. 384 Pixel).
       - bg-white: Hintergrundfarbe Weiß.
       - border-l: Ein Rahmen (Border) nur an der linken Seite (l = left).
       - border-gray-200: Die Farbe des Rahmens ist ein ganz helles Grau.
       - p-6: Ein Innenabstand (Padding) von 6 Einheiten auf allen Seiten.
       - shadow-xl: Ein großer Schatten nach links, damit das Panel Tiefe bekommt.
       - flex: Macht dieses Div zu einem Flex-Container.
       - flex-col: Ordnet die Inhalte (Titel, Nachrichten, Input) untereinander an.
    */
    <div className="w-96 bg-white border-l border-gray-200 p-6 shadow-xl flex flex-col">
      
      {/* ÜBERSCHRIFT 
          - text-xl: Schriftgröße "Extra Large".
          - font-semibold: Halbfette Schriftstärke.
          - mb-4: Margin-Bottom (Abstand nach unten) von 4 Einheiten.
          - text-emerald-600: Die Farbe ist ein schönes Smaragdgrün.
      */}
      <h2 className="text-xl font-semibold mb-4 text-emerald-600">Physio-Coach</h2>
      
      {/* DAS NACHRICHTEN-FENSTER 
          - h-[500px]: Eine feste Höhe von genau 500 Pixeln.
          - bg-gray-50: Ein fast weißer, sehr heller Grauton als Hintergrund.
          - rounded-lg: Abgerundete Ecken (lg = large).
          - mb-4: Abstand nach unten zum Eingabefeld.
          - border border-dashed border-gray-300: Ein gestrichelter, grauer Rahmen.
          - flex items-center justify-center: Zentriert den Text horizontal und vertikal.
          - text-gray-400: Hellgraue Textfarbe.
          - text-sm: Kleine Schriftgröße (small).
      */}
      <div className="h-[500px] bg-gray-50 rounded-lg mb-4 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
        Chat-Verlauf kommt hierher...
      </div>

      {/* DER EINGABE-BEREICH (unten fixiert durch mt-auto im Flex-Layout)
          - mt-auto: "Margin Top Auto" schiebt dieses Div ganz nach unten im Container.
      */}
      <div className="mt-auto">
        {/* DAS INPUT-FELD
            - w-full: Nimmt die komplette Breite des Containers ein.
            - p-3: Innenabstand von 3 Einheiten.
            - border border-gray-200: Ein feiner, durchgehender grauer Rahmen.
            - rounded-lg: Abgerundete Ecken.
            - focus:ring-2: Wenn man reinklickt, erscheint ein 2-Pixel-Ring.
            - focus:ring-emerald-500: Die Farbe des Rings beim Klicken ist grün.
            - outline-none: Verhindert, dass der Browser seinen eigenen (hässlichen) blauen Rahmen zeigt.
            - transition-all: Sorgt dafür, dass Effekte (wie das Aufleuchten des Rings) sanft einblenden.
            - text-sm: Kleine Schrift für den Text, den du tippst.
        */}
        <input 
          type="text" 
          placeholder="Schreib dem Coach..." 
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
        />
      </div>
    </div>
  );
}