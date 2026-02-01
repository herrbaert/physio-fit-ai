'use client';

// 1. IMPORT: Wir brauchen wieder unser Gedächtnis (useState).
import { useState } from 'react';

// Wir definieren hier einen "Typ" für unsere Nachrichten (gut für die Ordnung).
// Jede Nachricht hat einen Text und einen Absender (user oder bot).
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatPanel() {
  
  // 2. GEDÄCHTNIS FÜR DAS EINGABEFELD (wie eben)
  const [input, setInput] = useState('');

  // 3. GEDÄCHTNIS FÜR DIE NACHRICHTENLISTE
  // "messages" ist ein Array (eine Liste), die am Anfang leer ist: [].
  // Hier speichern wir alle Sprechblasen ab.
  const [messages, setMessages] = useState<Message[]>([]);

  // 4. FUNKTION: NACHRICHT HINZUFÜGEN
  const handleSend = () => {
    if (input.trim() === '') return; // Wenn nichts getippt wurde, mach nichts.

    // Wir erstellen ein neues Nachrichten-Objekt
    const newUserMessage: Message = {
      id: Date.now(),      // Eine einzigartige Nummer (Zeitstempel), damit React die Nachricht erkennt.
      text: input,         // Der Text, den du getippt hast.
      sender: 'user',      // Wir markieren es als User-Nachricht.
    };

    /* WICHTIGSTES REACT-KONZEPT:
       Wir ändern "messages" nicht direkt. Wir erstellen eine KOPIE der Liste
       und hängen die neue Nachricht hinten dran. 
       Das "...messages" bedeutet: "Nimm alles, was schon in der Liste war".
    */
    setMessages([...messages, newUserMessage]);

    // Eingabefeld wieder leer machen
    setInput('');

    // OPTIONAL: Wir simulieren eine Antwort vom Bot nach 1 Sekunde
    setTimeout(() => {
      const botReply: Message = {
        id: Date.now() + 1,
        text: "Ich habe deine Nachricht erhalten! (Später antwortet hier die KI)",
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botReply]); // "prev" sind die vorherigen Nachrichten
    }, 1000);
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 p-6 shadow-xl flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-emerald-600">Physio-Coach</h2>
      
      {/* 5. DAS DYNAMISCHE NACHRICHTEN-FENSTER 
          - flex-1: Nimmt allen verfügbaren Platz ein.
          - overflow-y-auto: Wenn es zu viele Nachrichten werden, erscheint ein Scrollbalken.
      */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        
        {/* HIER PASSIERT DIE MAGIE:
            Wir gehen die Liste "messages" durch und erstellen für jeden Eintrag ein Div.
            In React nutzt man dafür die Funktion ".map()".
        */}
        {messages.map((msg) => (
          <div 
            key={msg.id} // React braucht eine "key", um die Liste effizient zu verwalten.
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* DIE SPRECHBLASE
                Je nach Absender (user oder bot) ändern wir die Farbe.
            */}
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-emerald-500 text-white rounded-tr-none' // User: Grün, oben rechts eckig
                : 'bg-gray-100 text-gray-800 rounded-tl-none' // Bot: Grau, oben links eckig
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Wenn die Liste leer ist, zeigen wir einen kleinen Hinweis */}
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-xs mt-10">
            Schreib etwas, um das Training zu starten...
          </p>
        )}
      </div>

      {/* EINGABEBEREICH */}
      <div className="mt-auto flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Schreib dem Coach..." 
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
        />
        <button 
          onClick={handleSend}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium shadow-md"
        >
          Senden
        </button>
      </div>
    </div>
  );
}