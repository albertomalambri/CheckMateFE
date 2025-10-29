import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Partita } from '../../model/partita.model';
import { PartitaService } from '../../service/partita.service';
import { AlfiereComponent } from '../pieces/alfiere/alfiere.component';
import { CavalloComponent } from '../pieces/cavallo/cavallo.component';
import { PedoneComponent } from '../pieces/pedone/pedone.component';
import { ReComponent } from '../pieces/re/re.component';
import { ReginaComponent } from '../pieces/regina/regina.component';
import { TorreComponent } from '../pieces/torre/torre.component';

interface Pezzo {
  tipo: 'pedone' | 'torre' | 'cavallo' | 'alfiere' | 'regina' | 're';
  colore: 'white' | 'black';
}

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

  ngOnInit(): void {
    this.partitaService.getPartita().subscribe({
      next: (data) => {
        this.partita = data;
        this.scacchiera = data.scacchiera ?? this.initScacchieraDefault();
        this.loading = false; // fine caricamento
      },
      error: () => {
        this.scacchiera = this.initScacchieraDefault();
        this.loading = false;
      }
    });
  }

  startGame(): void {
    this.partitaService.startPartita().subscribe({
      next: (data) => {
        this.partita = data;
        this.scacchiera = data.scacchiera ?? this.initScacchieraDefault();
        this.gameStarted = true; // ora il pulsante si disabilita
      },
      error: (err) => console.error('Errore avvio partita:', err)
    });
  }


  initScacchieraDefault(): (Pezzo | null)[][] {
    const scacchiera: (Pezzo | null)[][] = [];

    // Riga 8 (index 0)
    scacchiera.push([
      { tipo: 'torre', colore: 'black' },
      { tipo: 'cavallo', colore: 'black' },
      { tipo: 'alfiere', colore: 'black' },
      { tipo: 'regina', colore: 'black' },
      { tipo: 're', colore: 'black' },
      { tipo: 'alfiere', colore: 'black' },
      { tipo: 'cavallo', colore: 'black' },
      { tipo: 'torre', colore: 'black' }
    ]);

    // Riga 7 (index 1) – pedoni neri
    scacchiera.push(Array(8).fill(null).map(() => ({ tipo: 'pedone', colore: 'black' })));

    // Righe 6-3 vuote
    for (let i = 0; i < 4; i++) {
      scacchiera.push(Array(8).fill(null));
    }

    // Riga 2 (index 6) – pedoni bianchi
    scacchiera.push(Array(8).fill(null).map(() => ({ tipo: 'pedone', colore: 'white' })));

    // Riga 1 (index 7) – pezzi bianchi
    scacchiera.push([
      { tipo: 'torre', colore: 'white' },
      { tipo: 'cavallo', colore: 'white' },
      { tipo: 'alfiere', colore: 'white' },
      { tipo: 'regina', colore: 'white' },
      { tipo: 're', colore: 'white' },
      { tipo: 'alfiere', colore: 'white' },
      { tipo: 'cavallo', colore: 'white' },
      { tipo: 'torre', colore: 'white' }
    ]);

    this.scacchiera = scacchiera;
    return scacchiera;
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

    this.setPezzo(r, c, pezzo);
    this.setPezzo(this.selectedPezzo.r, this.selectedPezzo.c, null);
    this.selectedPezzo = null;
  }
}

