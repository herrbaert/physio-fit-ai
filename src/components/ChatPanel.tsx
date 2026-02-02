// 1. ANWEISUNG FÜR NEXT.JS
// "use client" bedeutet: Diese Datei muss in den Browser des Nutzers geschickt werden.
// Warum? Weil wir hier Interaktivität brauchen (Tippen, Klicken, Scrollen).
// Server-Komponenten (der Standard in Next.js) können das nicht.
'use client';

// 2. IMPORTE
// Wir holen uns "useState" aus der React-Bibliothek.
// Das ist eines der wichtigsten Werkzeuge überhaupt. Es ist das "Kurzzeitgedächtnis" deiner App.
import { useState } from 'react';

// 3. TYP-DEFINITION (TypeScript)
// Das hier ist ein "Bauplan" oder "Vertrag".
// Wir sagen: "Immer wenn wir von einer 'Message' sprechen, muss sie genau diese drei Dinge haben."
// Das hilft uns, Tippfehler zu vermeiden (z.B. 'text' vs 'body').
interface Message {
  id: number;           // Eine eindeutige Nummer (damit React die Nachrichten unterscheiden kann)
  text: string;         // Der eigentliche Inhalt
  sender: 'user' | 'bot'; // Es darf NUR 'user' oder 'bot' sein, nichts anderes.
}

// 4. HAUPTKOMPONENTE
// Das ist die Funktion, die unser Chat-Fenster "malt".
export default function ChatPanel() {
  
  // --- A. DAS GEDÄCHTNIS (STATE) ---
  
  // useState funktioniert so: [AktuellerWert, FunktionZumÄndern] = useState(Startwert)
  
  // Gedächtnis 1: Was steht gerade im Eingabefeld?
  // Startwert ist ein leerer Text ('').
  const [input, setInput] = useState('');

  // Gedächtnis 2: Die Liste aller Nachrichten.
  // Startwert ist eine leere Liste ([]).
  // <Message[]> sagt: "Hier dürfen nur Dinge rein, die unserem Bauplan von oben entsprechen."
  const [messages, setMessages] = useState<Message[]>([]);

  // Gedächtnis 3: Warten wir gerade auf eine Antwort?
  // Startwert ist false (nein, wir tun gerade nichts).
  const [isLoading, setIsLoading] = useState(false);


  // --- B. DIE LOGIK (HANDLUNGEN) ---

  // Diese Funktion wird gestartet, wenn der User "Senden" drückt.
  // "async" steht davor, weil wir gleich Netzwerk-Anfragen machen, die Zeit brauchen.
  const handleSend = async () => {
    
    // SCHRITT 1: Validierung (Sicherheitscheck)
    // .trim() entfernt Leerzeichen am Anfang und Ende.
    // Wenn danach nichts übrig ist (User hat nur Leertaste gedrückt) ODER wir schon laden: ABBRUCH.
    if (!input.trim() || isLoading) return;

    // SCHRITT 2: User-Nachricht vorbereiten
    const userMsg: Message = { 
      id: Date.now(),   // Der aktuelle Zeitstempel (z.B. 1708623400) dient als eindeutige ID
      text: input,      // Der Text aus dem Eingabefeld
      sender: 'user' 
    };

    // SCHRITT 3: Optimistisches Update
    // Wir zeigen die Nachricht SOFORT an, ohne auf den Server zu warten. Das fühlt sich schneller an.
    // ...messages nimmt alle alten Nachrichten, userMsg ist die neue.
    const newHistory = [...messages, userMsg];
    setMessages(newHistory); // Update des Gedächtnisses für die Anzeige
    
    setInput('');       // Eingabefeld leeren für die nächste Frage
    setIsLoading(true); // "Lade-Modus" anschalten (zeigt z.B. "Coach tippt..." an)

    // SCHRITT 4: Netzwerk-Kommunikation (Der riskante Teil)
    // try...catch ist wie ein Airbag. Wenn im "try"-Block was knallt, fängt "catch" es auf.
    try {
      
      // Wir klopfen bei unserem eigenen API-Endpunkt an (/api/chat).
      // "await" heißt: "Code, bleib hier stehen, bis die Antwort da ist!"
      const response = await fetch('/api/chat', {
        method: 'POST', // POST = Wir übergeben Daten (einen Briefumschlag)
        headers: { 'Content-Type': 'application/json' }, // Wir sagen: "Im Umschlag ist JSON-Text"
        body: JSON.stringify({ 
          // Wir schicken die gesamte Historie mit, damit die KI den Kontext kennt.
          // Wir formen die Daten etwas um, damit sie sauber sind (nur role und content).
          messages: newHistory.map(m => ({ role: m.sender, content: m.text })) 
        }),
      });

      // Wenn der Server "404 Not Found" oder "500 Error" sagt, werfen wir manuell einen Fehler.
      if (!response.ok) throw new Error('Server hat Fehler gemeldet');

      // Wir packen die Antwort aus dem JSON-Format aus.
      const data = await response.json();

      // Wir bauen die Antwort-Nachricht für unser System
      const botReply: Message = {
        id: Date.now() + 1, // ID muss anders sein als die vorherige (+1 reicht)
        text: data.reply,   // Das Feld .reply haben wir in der route.ts definiert
        sender: 'bot',
      };

      // Wir fügen die Antwort der Liste hinzu.
      // (prev) => [...prev, botReply] ist die sicherste Art, State zu updaten.
      // Es bedeutet: "Nimm den Wert, der JETZT GERADE aktuell ist (prev), und häng was an."
      setMessages((prev) => [...prev, botReply]);

    } catch (error) {
      // Hier landen wir, wenn z.B. das Internet weg ist oder Ollama abgestürzt ist.
      console.error(error); // Fehler in der Entwickler-Konsole anzeigen
      
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: "Fehler: Konnte den KI-Server nicht erreichen.",
        sender: 'bot', // Wir tun so, als hätte der Bot den Fehler gemeldet
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      // Der "finally"-Block wird IMMER ausgeführt, egal ob Erfolg oder Fehler.
      // Wir schalten den Lade-Modus wieder aus, damit der User wieder tippen kann.
      setIsLoading(false);
    }
  };


  // --- C. DAS AUSSEHEN (RENDERING) ---
  // Hier wird HTML zurückgegeben, das der Browser anzeigt.
  return (
    // Ein Flex-Container, der die volle Höhe nutzt.
    <div className="w-96 bg-white border-l border-gray-200 p-6 shadow-xl flex flex-col h-full">
      
      <h2 className="text-xl font-semibold mb-4 text-emerald-600">Physio-AI Coach</h2>
      
      {/* 
         DER CHAT-VERLAUF 
         flex-1: Nimmt allen verfügbaren Platz ein (drückt das Eingabefeld nach unten).
         overflow-y-auto: Wenn der Text zu lang wird, erscheint hier ein Scrollbalken.
      */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        
        {/* FALL 1: Liste ist leer? Zeige einen Hinweis an. */}
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-10">
            Schreib mir, wo es weh tut.
          </p>
        )}
        
        {/* 
           FALL 2: Nachrichten anzeigen (.map)
           .map ist eine Schleife. Sie nimmt jede 'msg' aus der Liste und baut daraus HTML.
        */}
        {messages.map((msg) => (
          // key={msg.id}: React braucht das, um effizient zu wissen, welche Blase welche ist.
          // Hier nutzen wir Logik im CSS (Ternary Operator ? :):
          // Ist der Sender 'user'? Dann richte es rechts aus (justify-end). Sonst links.
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-emerald-500 text-white rounded-tr-none' // Grüne Blase, Ecke oben rechts eckig
                : 'bg-gray-100 text-gray-800 rounded-tl-none' // Graue Blase, Ecke oben links eckig
            }`}>
              {msg.text}
            </div>

          </div>
        ))}
        
        {/* LADE-ANZEIGE: Nur sichtbar, wenn isLoading === true */}
        {isLoading && (
          <div className="flex justify-start">
            {/* animate-pulse macht den "Pocher"-Effekt (hell/dunkel) */}
            <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none text-gray-400 text-xs italic animate-pulse">
              Coach tippt...
            </div>
          </div>
        )}
      </div>

      {/* DER EINGABE-BEREICH (unten fixiert durch flex-col Layout) */}
      <div className="mt-auto flex gap-2">
        <input 
          type="text" 
          // Two-Way-Binding: Der Wert im Feld ist IMMER an die Variable 'input' gekoppelt.
          value={input}
          // Wenn man tippt, wird setInput aufgerufen -> Gedächtnis wird aktualisiert.
          onChange={(e) => setInput(e.target.value)}
          // Wenn man Enter drückt, wird gesendet.
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          
          placeholder="Frag deinen Coach..." 
          // Wenn geladen wird, sperren wir das Feld (disabled).
          disabled={isLoading} 
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all disabled:bg-gray-50"
        />
        
        <button 
          onClick={handleSend} 
          // Button ist inaktiv, wenn geladen wird ODER das Feld leer ist (!input.trim()).
          disabled={isLoading || !input.trim()} 
          className={`px-4 py-2 rounded-lg transition-all shadow-md text-white ${
            isLoading || !input.trim() 
              ? 'bg-gray-300 cursor-not-allowed' // Aussehen wenn inaktiv
              : 'bg-emerald-500 hover:bg-emerald-600' // Aussehen wenn aktiv
          }`}
        >
          Senden
        </button>
      </div>

    </div>
  );
}
