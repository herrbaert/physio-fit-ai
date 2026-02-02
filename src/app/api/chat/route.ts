// src/app/api/chat/route.ts

// Wir importieren Hilfsmittel von Next.js, um HTTP-Anfragen (Requests) und Antworten (Responses) zu verarbeiten.
import { NextResponse } from 'next/server';

// Diese Funktion wird automatisch aufgerufen, wenn jemand eine "POST"-Anfrage an /api/chat sendet.
// "async" bedeutet: Diese Funktion muss zwischendurch warten (z.B. auf die KI), sie läuft nicht in einem Rutsch durch.
export async function POST(req: Request) {
  try {
    // 1. WAS HAT DER NUTZER GESAGT?
    // Wir lesen den "Body" (Inhalt) der Anfrage, die vom Frontend kommt.
    // Wir erwarten ein Objekt, das "messages" enthält.
    const { messages } = await req.json();

    // Konsolenausgabe für dich zum Debuggen (erscheint in deinem Terminal, wo 'npm run dev' läuft)
    console.log('Nachricht an KI senden:', messages);

    // 2. WEITERLEITUNG AN OLLAMA
    // Wir tun jetzt so, als wären wir ein Browser und rufen den Ollama-Server an.
    // 'fetch' ist der Befehl, um Daten von einer URL zu holen oder zu senden.
    const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
      method: 'POST', // Wir wollen Daten SENDEN (nicht nur lesen)
      headers: {
        'Content-Type': 'application/json', // Wir sagen dem Server: "Hier kommen JSON-Daten"
      },
      body: JSON.stringify({
        model: 'qwen2.5:7b', // WICHTIG: Das Modell muss exakt so heißen wie das, was du in Ollama geladen hast
        messages: messages,  // Die Chat-Historie, die wir oben ausgepackt haben
        stream: false,       // false = Wir warten auf die ganze Antwort (einfacher für den Anfang)
      }),
    });

    // 3. PRÜFEN: HAT OLLAMA GEANTWORTET?
    // Wenn 'ok' nicht true ist, gab es einen Fehler (z.B. Modell nicht gefunden, Server aus).
    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error('Ollama Fehler:', errorText);
      return NextResponse.json({ error: 'Fehler bei Ollama: ' + errorText }, { status: 500 });
    }

    // 4. ANTWORT AUSPACKEN
    // Ollama schickt uns ein JSON-Paket zurück. Das müssen wir erst "parsen" (lesen).
    const data = await ollamaResponse.json();
    
    // Die eigentliche Text-Antwort steckt tief im Objekt: data -> message -> content
    const botReply = data.message?.content || "Keine Antwort erhalten.";

    // 5. ANTWORT AN DEIN FRONTEND ZURÜCKSCHICKEN
    // Wir bauen ein Paket für dein ChatPanel und schicken es ab.
    return NextResponse.json({ reply: botReply });

  } catch (error) {
    // Falls irgendwas völlig schiefgeht (z.B. Netzwerk weg, Code abgestürzt)
    console.error('Server Fehler:', error);
    return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 });
  }
}
