import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Partita} from '../../model/partita.model';
import {PartitaService} from '../../service/partita.service';

@Component({
  selector: 'app-partita-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partita-view.html',
  styleUrls: ['./partita-view.css']
})
export class PartitaViewComponent implements OnInit {
  public partita?: Partita;

  constructor(private partitaService: PartitaService) {}

  ngOnInit(): void
  {
    this.partitaService.getPartita().subscribe({
      next: (data) => this.partita = data,
      error: (err) => {
        console.error('Errore nel caricamento della partita:', err);
        this.partita = undefined;
      }
    });
  }
  righe:number[] = [8, 7, 6, 5, 4, 3, 2, 1];
  colonne:string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  isBianca(r: number, c: string): boolean {
    const colIndex = this.colonne.indexOf(c);
    return (r + colIndex) % 2 === 0;
  }

  getPezzo(r: number, c: string): string
  {
    // Puoi mappare lo stato FEN o usare dati mock
    return '';
  }
}
