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
  public partita?: Partita;

  constructor(private partitaService: PartitaService) {}

  ngOnInit(): void {
    this.partitaService.getPartita().subscribe({
      next: (data) => this.partita = data,
      error: (err) => {
        console.error('Errore nel caricamento della partita:', err);
        this.partita = undefined;
      }
    });
  }

  righe: number[] = [8, 7, 6, 5, 4, 3, 2, 1];
  colonne: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  // --- Scacchiera iniziale ---
  scacchiera: (Pezzo | null)[][] = [
    [
      { tipo: 'torre', colore: 'black' },
      { tipo: 'cavallo', colore: 'black' },
      { tipo: 'alfiere', colore: 'black' },
      { tipo: 'regina', colore: 'black' },
      { tipo: 're', colore: 'black' },
      { tipo: 'alfiere', colore: 'black' },
      { tipo: 'cavallo', colore: 'black' },
      { tipo: 'torre', colore: 'black' }
    ],
    Array(8).fill(null).map(() => ({ tipo: 'pedone', colore: 'black' })),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null).map(() => ({ tipo: 'pedone', colore: 'white' })),
    [
      { tipo: 'torre', colore: 'white' },
      { tipo: 'cavallo', colore: 'white' },
      { tipo: 'alfiere', colore: 'white' },
      { tipo: 'regina', colore: 'white' },
      { tipo: 're', colore: 'white' },
      { tipo: 'alfiere', colore: 'white' },
      { tipo: 'cavallo', colore: 'white' },
      { tipo: 'torre', colore: 'white' }
    ]
  ];

  // --- Helper scacchiera ---
  isBianca(r: number, c: string): boolean {
    const colIndex = this.colonne.indexOf(c);
    return (r + colIndex) % 2 === 0;
  }

  getPezzo(r: number, c: string): Pezzo | null {
    const colIndex = this.colonne.indexOf(c);
    return this.scacchiera[8 - r][colIndex]; // 8-r perché righe = 8..1
  }

  setPezzo(r: number, c: string, pezzo: Pezzo | null) {
    const colIdx = this.colonne.indexOf(c);
    this.scacchiera[8 - r][colIdx] = pezzo;
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
    event.preventDefault(); // necessario per permettere il drop
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

