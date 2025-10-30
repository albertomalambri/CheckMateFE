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
    TorreComponent
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
  loading: boolean = false;

  constructor(private partitaService: PartitaService) {}

  errorMessage = '';

  convertResponse(data: any){
    this.scacchiera = [];
    for(let i = 0; i < 8; i++){
      this.scacchiera.push(data.scacchiera.splice(0, 8));
    }
  }

  ngOnInit(): void {
    this.partitaService.getPartita().subscribe({
      next: (data) => {
        this.partita = data;
        this.convertResponse(data);
        this.loading = false; // fine caricamento
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  startGame(): void {
    this.loading = true;
    this.partitaService.getPartita().subscribe({
      next: (partita) => {
        this.partita = partita;
        this.loading = false;
        console.log('✅ Partita creata:', this.partita);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // --- Funzioni per colore celle e gestione pezzi ---
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

    const mossa: Mossa = {
      numero: 0,
      da: `${this.selectedPezzo.r}${this.selectedPezzo.c}`,
      a: `${r}${c}`,
      pezzo: PezzoCodice[pezzo.pezzo as keyof typeof PezzoCodice],
      cattura: this.getPezzo(r, c) != null,
      arrocco: false,
      promozione: false
    };

    // 🔹 Usa `id` della partita, non gameStateId
    if (!this.partita?.id) {
      console.error('⚠️ ID partita mancante.');
      return;
    }

    console.log('➡️ Invio mossa con ID partita:', this.partita.id);
    console.log('Mossa:', mossa);

    this.partitaService.eseguiMossa(this.partita.id, mossa).subscribe({
      next: (stato: ScacchieraGameStateDTO) => {
        this.scacchiera = this.convertiScacchiera(stato.scacchiera)
        this.selectedPezzo = null;
      },
      error: err => {
        console.error('Errore nella mossa:', err);
        this.selectedPezzo = null;
      }
    });
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
}

