import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Mossa, Partita} from '../../model/partita.model';
import { PartitaService } from '../../service/partita.service';
import { AlfiereComponent } from '../pieces/alfiere/alfiere.component';
import { CavalloComponent } from '../pieces/cavallo/cavallo.component';
import { PedoneComponent } from '../pieces/pedone/pedone.component';
import { ReComponent } from '../pieces/re/re.component';
import { ReginaComponent } from '../pieces/regina/regina.component';
import { TorreComponent } from '../pieces/torre/torre.component';
import {Pezzo, PezzoCodice} from '../../model/pezzo.model';
import {cellaDTO} from '../../model/partita.model';
import{ScacchieraGameStateDTO} from '../../model/partita.model';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

const CodiceToBackendPezzo: Record<PezzoCodice, string> = {
  PE: 'pedone',
  TO: 'torre',
  CA: 'cavallo',
  AL: 'alfiere',
  RG: 'regina',
  RE: 're'
};


@Component({
  selector: 'app-partita-view',
  standalone: true,
  imports: [
    CommonModule,
    AlfiereComponent,
    CavalloComponent,
    PedoneComponent,
    ReComponent,
    ReginaComponent,
    TorreComponent,
    FormsModule
  ],
  templateUrl: './partita-view.html',
  styleUrls: ['./partita-view.css']
})



export class PartitaViewComponent implements OnInit {

  partita: Partita = {
    id: 0,
    gameStateId: 0,
    giocatoreBianco: '',
    giocatoreNero: '',
    risultato: '',
    statoFinaleFEN: '',
    mosse: [],
    scacchiera: []
  };

  scacchiera: (Pezzo | null)[][] = [];
  righe: number[] = [8, 7, 6, 5, 4, 3, 2, 1];
  colonne: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  gameStarted: boolean = false;
  gameEnded: boolean = false;
  loading: boolean = false;
  risultato: string = "";
  coloreGiocatore: string = "";
  showPromozioneDropdown: boolean = false;
  promozioneDestinazione: { r: number, c: string } | null = null;
  pezzoPromozione: string = ''; // default: donna

  private stockfish: any;

  constructor(private partitaService: PartitaService, private route: Router) {}

  errorMessage = '';
  valutazioneCorrente: number = 0; // punteggio del motore (in centipawn)
  analisi: string = ''; // testo da mostrare accanto alla mossa

  mosse: string[] = [];

  faiMossa(mossa: string) {
    this.mosse.push(mossa);
  }

  convertResponse(data: any) {
    if (!data || !Array.isArray(data.scacchiera)) {
      console.warn("⚠️ Nessuna scacchiera trovata:", data);
      this.scacchiera = [];
      return;
    }

    const copia = [...data.scacchiera];
    this.scacchiera = [];

    for (let i = 0; i < 8; i++) {
      this.scacchiera.push(copia.splice(0, 8));
    }
  }

  async ngOnInit(): Promise<void> {
    // 🔹 1. Carica la partita dal backend
    this.partitaService.getPartita().subscribe({
      next: (data) => {
        console.log("✅ Dati ricevuti:", data);
        this.partita = data;
        this.convertResponse(data);
        this.loading = false;
      },
      error: (err) => {
        console.error("❌ Errore nel caricamento della partita:", err);
        this.loading = false;
      }
    });

    // 🔹 2. Inizializza Stockfish come Web Worker
    if (typeof Worker !== 'undefined') {
      try {
        // Il percorso parte dalla cartella del componente TypeScript
        this.stockfish = new Worker(
          new URL('../../workers/stockfish.worker.ts', import.meta.url),
          { type: 'module' }
        );

        // Gestione dei messaggi in arrivo dal motore
        this.stockfish.onmessage = (event: any) => {
          console.log('📨 Messaggio da Stockfish:', event.data);
        };

        // Invia comando iniziale al motore
        this.stockfish.postMessage('uci');
        console.log('♟️ Stockfish inizializzato correttamente ✅');
      } catch (error) {
        console.error('❌ Errore nel caricamento di Stockfish:', error);
      }
    } else {
      console.error('❌ Web Workers non supportati nel browser.');
    }
  }




  startGame(): void {
    this.loading = true;
    const audio = new Audio('chess-pieces-hitting-wooden-board-99336_vlXIuPS5.mp3'); // piccolo suono finto
    audio.play().catch(() => {});
    this.partitaService.getPartita().subscribe({
      next: (partita) => {
        this.partita = partita;
        this.loading = false;
        this.gameStarted = true;
        console.log('✅ Partita creata:', this.partita);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  isBianca(r: number, c: string): boolean {
    const colIndex = this.colonne.indexOf(c);
    return (r + colIndex) % 2 === 0;
  }

  getPezzo(r: number, c: string): Pezzo | null {

    if (!this.scacchiera?.length) return null;

    const rowIndex = 8 - r; // r=8 => 0, r=1 => 7
    const colIndex = this.colonne.indexOf(c);
    if (rowIndex < 0 || rowIndex > 7 || colIndex < 0 || colIndex > 7) return null;
    if(!this.scacchiera[rowIndex][colIndex]?.pezzo)
      return null;
    return this.scacchiera[rowIndex][colIndex] ?? null;
  }

  setPezzo(r: number, c: string, pezzo: Pezzo | null) {
    const colIndex = this.colonne.indexOf(c);
    this.scacchiera![8 - r][colIndex] = pezzo;
  }

  // --- Drag & Drop ---
  selectedPezzo: { r: number; c: string } | null = null;

  pickPezzo(event: DragEvent, r: number, c: string) {
    const pezzo = this.getPezzo(r, c);
    if (!pezzo) return;
    this.selectedPezzo = { r, c };
    event.dataTransfer?.setData('text/plain', `${r},${c}`);
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  dropPezzo(event: DragEvent, r: number, c: string) {

    event.preventDefault();
    if (!this.selectedPezzo) return;

    const pezzo = this.getPezzo(this.selectedPezzo.r, this.selectedPezzo.c);
    if (!pezzo) return;

    if (this.isPromotion(pezzo, r)) {
      this.promozioneDestinazione = { r, c };
      this.showPromozioneDropdown = true;
      return;
    }

    this.inviaMossa(r, c, pezzo.pezzo, false, '');


  }

  inviaMossa(r: number, c: string, pezzo: string, promozione: boolean, pezzoPromozione: string) {
    if (!this.selectedPezzo) return;
    const mossa: Mossa = {
      numero: 0,
      da: `${this.selectedPezzo.r}${this.selectedPezzo.c}`,
      a: `${r}${c}`,
      pezzo: PezzoCodice[pezzo as keyof typeof PezzoCodice],
      cattura: this.getPezzo(r, c) != null,
      arrocco: false,
      promozione: promozione,
      pezzoPromozione: PezzoCodice[pezzoPromozione as keyof typeof PezzoCodice],
    };

    const pezzoOggetto = this.getPezzo(this.selectedPezzo.r, this.selectedPezzo.c);
    if (pezzoOggetto) {
      const nomePezzo = pezzoOggetto.pezzo?.toUpperCase() ?? 'PEZZO';
      const coloreSimbolo = pezzoOggetto.colorePezzo === 'BIANCO' ? '⚪' : '⚫';
      this.faiMossa(`${coloreSimbolo} ${nomePezzo} da ${this.selectedPezzo.c}${this.selectedPezzo.r} a ${c}${r}`);
    }


    // 🔹 Usa `id` della partita, non gameStateId
    if (!this.partita?.id) {
      console.error('⚠️ ID partita mancante.');
      return;
    }

    console.log('➡️ Invio mossa con ID partita:', this.partita.id);
    console.log('Mossa:', mossa);

    this.partitaService.eseguiMossa(this.partita.id, mossa).subscribe({
      next: async (stato: ScacchieraGameStateDTO) => {
          this.scacchiera = this.convertiScacchiera(stato.scacchiera);
          this.selectedPezzo = null;
          this.promozioneDestinazione = null;
          this.showPromozioneDropdown = false;
          this.pezzoPromozione = '';
          this.coloreGiocatore = stato.currentPlayer;

        // 🎯 ANALISI AUTOMATICA DELLA MOSSA
        const fenPrima = this.convertiScacchieraInFEN(); // FEN prima della mossa
        const valutazionePrima = await this.analizzaPosizione(fenPrima);

        // Applica la mossa sulla scacchiera prima di calcolare fenDopo
        // (Assicurati di aver aggiornato la scacchiera prima di chiamare convertiScacchieraInFEN)
        const fenDopo = this.convertiScacchieraInFEN(); // FEN dopo la mossa
        const valutazioneDopo = await this.analizzaPosizione(fenDopo);

        // calcola il delta
        const delta = valutazioneDopo - valutazionePrima;

        // --- soglie modificate per avere più varietà nei giudizi ---
        let giudizio = '';
        if (delta >= 1.5) giudizio = '✅ Ottima mossa';
        else if (delta >= 0.5) giudizio = '👍 Buona';
        else if (delta >= -0.5) giudizio = '⚠️ Imprecisa';
        else giudizio = '❌ Errore';

        this.mosse[this.mosse.length - 1] += ` → ${giudizio} (Δ=${delta.toFixed(2)}, Val=${valutazioneDopo.toFixed(2)})`;


        console.log(`Analisi: ${giudizio} (${valutazioneDopo.toFixed(2)})`);
        //if(tipoPartita="AI")
          this.riceviMossaAI();
          // ✅ Qui puoi controllare lo stato della partita
        if (stato.checkMate) {
          const audio = new Audio('11l-victory_trumpet-1749704501065-358769.mp3'); // piccolo suono finto
          audio.play().catch(() => {});
          this.partitaService.finePartita(this.partita.id);
          this.gameEnded = true;
          if (this.coloreGiocatore=="BIANCO")
            this.risultato = "Il giocatore NERO vince il game !";
          else
            this.risultato = "Il giocatore BIANCO vince il game !";
          // (opzionale: salva risultato o blocca altre mosse)
        }
        else if (stato.stallo) {
          const audio = new Audio('boo-36556.mp3'); // piccolo suono finto
          audio.play().catch(() => {});
          this.partitaService.finePartita(this.partita.id);
          this.gameEnded = true;
          this.risultato = "Pareggio !";
        }
        else if (stato.check) {
          const audio = new Audio('11l-victory_trumpet-1749704463122-358787.mp3'); // piccolo suono finto
          audio.play().catch(() => {});
        }
        else {
          const audio = new Audio('ficha-de-ajedrez-34722.mp3'); // piccolo suono finto
          audio.play().catch(() => {
          });
        }
      },
      error: err => {
        console.error('Errore nella mossa:', err);
        this.selectedPezzo = null;
        this.promozioneDestinazione = null;
        this.showPromozioneDropdown = false;
        this.pezzoPromozione = '';
      }
    });
  }

  riceviMossaAI(): void
  {
    // 🔹 Usa `id` della partita, non gameStateId
    if (!this.partita?.id) {
      console.error('⚠️ ID partita mancante.');
      return;
    }

    this.partitaService.eseguiMossaAI(this.partita.id).subscribe({
      next: async (stato: ScacchieraGameStateDTO) => {
        this.scacchiera = this.convertiScacchiera(stato.scacchiera);
        this.selectedPezzo = null;
        this.promozioneDestinazione = null;
        this.showPromozioneDropdown = false;
        this.pezzoPromozione = '';
        this.coloreGiocatore = stato.currentPlayer;

        // 🎯 ANALISI AUTOMATICA DELLA MOSSA
        const fenPrima = this.convertiScacchieraInFEN(); // FEN prima della mossa
        const valutazionePrima = await this.analizzaPosizione(fenPrima);

        // Applica la mossa sulla scacchiera prima di calcolare fenDopo
        // (Assicurati di aver aggiornato la scacchiera prima di chiamare convertiScacchieraInFEN)
        const fenDopo = this.convertiScacchieraInFEN(); // FEN dopo la mossa
        const valutazioneDopo = await this.analizzaPosizione(fenDopo);

        // calcola il delta
        const delta = valutazioneDopo - valutazionePrima;

        // --- soglie modificate per avere più varietà nei giudizi ---
        let giudizio = '';
        if (delta >= 1.5) giudizio = '✅ Ottima mossa';
        else if (delta >= 0.5) giudizio = '👍 Buona';
        else if (delta >= -0.5) giudizio = '⚠️ Imprecisa';
        else giudizio = '❌ Errore';

        this.mosse[this.mosse.length - 1] += ` → ${giudizio} (Δ=${delta.toFixed(2)}, Val=${valutazioneDopo.toFixed(2)})`;


        console.log(`Analisi: ${giudizio} (${valutazioneDopo.toFixed(2)})`);

        // ✅ Qui puoi controllare lo stato della partita
        if (stato.checkMate) {
          const audio = new Audio('11l-victory_trumpet-1749704501065-358769.mp3'); // piccolo suono finto
          audio.play().catch(() => {});
          this.partitaService.finePartita(this.partita.id);
          this.gameEnded = true;
          if (this.coloreGiocatore=="BIANCO")
            this.risultato = "Il giocatore NERO vince il game !";
          else
            this.risultato = "Il giocatore BIANCO vince il game !";
          // (opzionale: salva risultato o blocca altre mosse)
        }
        else if (stato.stallo) {
          const audio = new Audio('boo-36556.mp3'); // piccolo suono finto
          audio.play().catch(() => {});
          this.partitaService.finePartita(this.partita.id);
          this.gameEnded = true;
          this.risultato = "Pareggio !";
        }
        else if (stato.check) {
          const audio = new Audio('11l-victory_trumpet-1749704463122-358787.mp3'); // piccolo suono finto
          audio.play().catch(() => {});
        }
        else {
          const audio = new Audio('ficha-de-ajedrez-34722.mp3'); // piccolo suono finto
          audio.play().catch(() => {
          });
        }
      },
      error: err => {
        console.error('Errore nella mossa:', err);
        this.selectedPezzo = null;
        this.promozioneDestinazione = null;
        this.showPromozioneDropdown = false;
        this.pezzoPromozione = '';
      }
    });
  }

  isPromotion(pezzo:Pezzo, r:number): boolean{

    if(pezzo.pezzo=="PEDONE" && pezzo.colorePezzo =="BIANCO" && r == 8){
      return true;
    }
    if(pezzo.pezzo=="PEDONE" && pezzo.colorePezzo =="NERO" && r == 1){
      return true
    }
    return false;
  }

  confermaPromozione() {
    if (!this.promozioneDestinazione || !this.selectedPezzo) return;

    const { r, c } = this.promozioneDestinazione;
    this.inviaMossa(r, c,"PEDONE", true, this.pezzoPromozione);
  }

  getColorePezzo(pezzo: Pezzo){
    if(pezzo.colorePezzo == "BIANCO"){
      return "white"
    }
    return "black"
  }

  convertiScacchiera(scacchiera: any[]): any[][] {
    const righe: any[][] = [];
    for (let i = 0; i < 8; i++) {
      righe.push(scacchiera.slice(i * 8, (i + 1) * 8));
    }
    return righe;
  }

  riproduciSuono(file: string) {
    const audio = new Audio();
    audio.src = `${file}`;
    audio.load();
    audio.volume = 1.0; // facoltativo
    audio.play().catch(err => {
      console.warn('⚠️ Impossibile riprodurre il suono:', err);
    });
  }

  analizzaPosizione(fen: string) {
    return new Promise<number>((resolve) => {
      let valutazione = 0;
      this.stockfish.onmessage = (event: any) => {
        const msg = event.data || event;
        if (typeof msg === 'string' && msg.includes('score cp')) {
          const match = msg.match(/score cp (-?\d+)/);
          if (match) valutazione = parseInt(match[1]) / 100;
        }
        if (typeof msg === 'string' && msg.includes('bestmove')) {
          resolve(valutazione);
        }
      };
      this.stockfish.postMessage(`position fen ${fen}`);
      this.stockfish.postMessage('go depth 12'); // profondità analisi
    });
  }

  convertiScacchieraInFEN(): string {
    const mappaPezzi: Record<string, string> = {
      PEDONE_BIANCO: 'P', TORRE_BIANCO: 'R', CAVALLO_BIANCO: 'N', ALFIERE_BIANCO: 'B', REGINA_BIANCO: 'Q', RE_BIANCO: 'K',
      PEDONE_NERO: 'p', TORRE_NERO: 'r', CAVALLO_NERO: 'n', ALFIERE_NERO: 'b', REGINA_NERO: 'q', RE_NERO: 'k',
    };

    return this.scacchiera.map(riga => {
      let rigaFEN = '';
      let vuote = 0;
      for (const cella of riga) {
        if (!cella || !cella.pezzo) vuote++;
        else {
          if (vuote > 0) { rigaFEN += vuote; vuote = 0; }
          const chiave = `${cella.pezzo}_${cella.colorePezzo}`;
          rigaFEN += mappaPezzi[chiave] ?? '?';
        }
      }
      if (vuote > 0) rigaFEN += vuote;
      return rigaFEN;
    }).join('/') + ' w - - 0 1'; // parte finale semplificata
  }

  restartGame(): void {
    console.log('🔁 Riavvio della partita in corso...');

    // 🔹 1. Reset completo dello stato del componente
    this.gameEnded = false;
    this.gameStarted = false;
    this.loading = true;
    this.risultato = '';
    this.mosse = [];
    this.selectedPezzo = null;
    this.scacchiera = Array.from({ length: 8 }, () => Array(8).fill(null));

    // 🔹 2. Richiedi una nuova partita al backend
    this.partitaService.startPartita().subscribe({
      next: (nuovaPartita) => {
        console.log('✅ Nuova partita ricevuta:', nuovaPartita);
        this.partita = nuovaPartita;

        // 🔹 3. Ricostruisci la scacchiera
        this.convertResponse(nuovaPartita);
        this.loading = false;
        this.gameStarted = true;

        // 🔊 suono d’avvio
        const audio = new Audio('chess-pieces-hitting-wooden-board-99336_vlXIuPS5.mp3');
        audio.play().catch(() => {});
      },
      error: (err) => {
        console.error('❌ Errore durante il riavvio della partita:', err);
        this.loading = false;
      }
    });
  }



  goHome() {
    this.route.navigate(['']); //
  }



}

