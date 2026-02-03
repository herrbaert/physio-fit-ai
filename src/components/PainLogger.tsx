'use client'; // Wie immer: Das hier läuft im Browser (Interaktivität nötig!)

import { useState } from 'react';
// Wir importieren Icons aus 'lucide-react'. Das sind SVG-Icons, die man wie Komponenten nutzen kann.
// Activity = Herzfrequenz-Linie, Save = Diskette, AlertCircle = Warnhinweis (optional)
import { Activity, Save } from 'lucide-react'; 

export default function PainLogger() {
  
  // --- A. STATE (GEDÄCHTNIS) ---
  
  // 1. Welcher Körperteil ist gerade aktiv? 
  // Wir setzen 'Rücken' als Startwert, damit nicht nichts ausgewählt ist.
  const [bodyPart, setBodyPart] = useState('Rücken');
  
  // 2. Wie stark ist der Schmerz? (Zahl von 0 bis 10)
  const [painLevel, setPainLevel] = useState(5);
  
  // 3. Haben wir gerade erfolgreich gespeichert?
  // Das nutzen wir, um den Button kurz grün blinken zu lassen.
  const [saved, setSaved] = useState(false);

  // Eine einfache Liste (Array) mit Texten, über die wir gleich "mappen" (eine Schleife laufen lassen).
  // Wenn du mehr Teile willst, schreib sie einfach hier rein.
  const bodyParts = ['Nacken', 'Schultern', 'Rücken', 'Hüfte', 'Knie', 'Fußgelenk'];

  
  // --- B. LOGIK (FUNKTIONEN) ---

  // Wird aufgerufen, wenn man auf "Speichern" klickt.
  const handleSave = () => {
    // Später senden wir das hier an eine Datenbank.
    // Für jetzt reicht ein Log in der Konsole (F12 im Browser), um zu sehen, dass es klappt.
    console.log(`Datenpaket: { part: "${bodyPart}", level: ${painLevel} }`);
    
    // VISUELLES FEEDBACK:
    setSaved(true); // Schaltet den Zustand auf "Gespeichert" (Button wird grün)
    
    // Nach 2000 Millisekunden (2 Sekunden) schalten wir automatisch zurück.
    setTimeout(() => {
      setSaved(false); // Button wird wieder normal
    }, 2000);
  };

  // Eine kleine Helfer-Funktion für dynamische Farben.
  // Je höher der Schmerz (level), desto "gefährlicher" die Textfarbe.
  const getPainColor = (level: number) => {
    if (level <= 3) return 'text-emerald-500'; // Grün (Alles okay)
    if (level <= 6) return 'text-yellow-500';  // Gelb (Achtung)
    if (level <= 8) return 'text-orange-500';  // Orange (Schmerzhaft)
    return 'text-red-600';                     // Rot (Alarm!)
  };


  // --- C. UI (DAS AUSSEHEN) ---
  return (
    // Die äußere Karte: Weißer Hintergrund, abgerundete Ecken (rounded-2xl), leichter Schatten.
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 w-full h-full flex flex-col">
      
      {/* 1. HEADER (Titelzeile) */}
      <div className="flex items-center gap-3 mb-6">
        {/* Das Icon bekommt einen runden Hintergrund (rounded-full) in hellem Smaragdgrün */}
        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
          <Activity size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Schmerz-Check</h2>
          <p className="text-sm text-gray-500">Wie fühlst du dich heute?</p>
        </div>
      </div>

      {/* 2. INHALT (Mitte) */}
      {/* space-y-8 sorgt für gleichmäßigen Abstand zwischen den Abschnitten */}
      <div className="space-y-8 flex-1">
        
        {/* ABSCHNITT A: KÖRPERTEILE (Buttons) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Betroffener Bereich
          </label>
          
          {/* Grid Layout: Wir wollen 3 Spalten nebeneinander. */}
          <div className="grid grid-cols-3 gap-2">
            
            {/* HIER IST DIE MAGIE (.map): */}
            {bodyParts.map((part) => (
              <button
                key={part} // Wichtig für React!
                onClick={() => setBodyPart(part)} // Beim Klicken setzen wir den State
                
                // DYNAMISCHE KLASSEN:
                // Wir nutzen Backticks (`...`), um JavaScript in den String einzubauen.
                // ${bodyPart === part ? '...' : '...'} bedeutet:
                // "Ist DIESER Button gerade der ausgewählte? Dann mach ihn grün. Wenn nicht, mach ihn grau."
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  bodyPart === part
                    ? 'bg-emerald-500 text-white shadow-md' // Aktiv-Style
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100' // Inaktiv-Style
                }`}
              >
                {part}
              </button>
            ))}

          </div>
        </div>

        {/* ABSCHNITT B: SLIDER (Schieberegler) */}
        <div>
          {/* Label und Wert-Anzeige nebeneinander (flex justify-between) */}
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-medium text-gray-700">Intensität</label>
            
            {/* Hier rufen wir unsere Farb-Funktion auf: getPainColor(painLevel) */}
            <span className={`text-2xl font-bold ${getPainColor(painLevel)}`}>
              {painLevel} <span className="text-sm text-gray-400 font-normal">/ 10</span>
            </span>
          </div>
          
          {/* Der eigentliche Slider */}
          <input
            type="range"
            min="0" max="10" step="1" // Von 0 bis 10 in 1er Schritten
            value={painLevel}         // Bindung an den State
            onChange={(e) => setPainLevel(parseInt(e.target.value))} // Update State beim Ziehen
            
            // accent-emerald-500 färbt den "Knubbel" und den Balken grün (in modernen Browsern)
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          
          {/* Kleine Beschriftung unter dem Slider */}
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
            <span>Schmerzfrei</span>
            <span>Unerträglich</span>
          </div>
        </div>

      </div>

      {/* 3. FOOTER (Speichern Button) */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          // Auch hier wieder dynamisches Styling für Feedback
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            saved 
              ? 'bg-green-100 text-green-700' // Wenn gespeichert: Hellgrün
              : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl' // Normal: Dunkelgrau + Schatten
          }`}
        >
          {/* Bedingter Inhalt: Zeige Text ODER Icon+Text */}
          {saved ? (
            <>Erfasst!</>
          ) : (
            <>
              <Save size={18} />
              Eintrag speichern
            </>
          )}
        </button>
      </div>

    </div>
  );
}
