/// <reference lib="webworker" />

import Stockfish from 'stockfish.js';

// Il worker riceve messaggi dal componente Angular
addEventListener('message', (event) => {
  const data = event.data as string;

  // Se non abbiamo ancora inizializzato Stockfish, facciamolo
  if (!(self as any).stockfishInstance) {
    try {
      // Crea l'istanza di Stockfish
      (self as any).stockfishInstance = Stockfish();

      // Gestione dei messaggi del motore
      (self as any).stockfishInstance.onmessage = (msgEvent: any) => {
        const message = msgEvent.data || msgEvent;
        postMessage(message); // invia tutto al componente Angular
      };
    } catch (err) {
      postMessage(`❌ Errore nell'inizializzazione di Stockfish: ${err}`);
      return;
    }
  }

  const engine = (self as any).stockfishInstance;

  // Invia comandi al motore
  engine.postMessage(data);
});


