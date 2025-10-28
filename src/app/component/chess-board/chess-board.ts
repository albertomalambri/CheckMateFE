import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chess-board.html',
  styleUrls: ['./chess-board.css']
})
export class ChessBoardComponent {
  readonly whiteAtBottom = true;
  pieceColors: { [key: string]: string } = {};

  constructor() {
    this.setPieceColors();
    this.updateCells();
  }

  setPieceColors() {
    const whitePieces = ['♙', '♖', '♘', '♗', '♕', '♔'];
    const blackPieces = ['♟', '♜', '♞', '♝', '♛', '♚'];

    whitePieces.forEach(piece => {
      this.pieceColors[piece] = 'white';
    });

    blackPieces.forEach(piece => {
      this.pieceColors[piece] = 'black';
    });
  }

  draggedPiece: { row: number; col: number; piece: string } | null = null;

  // Board come array bidimensionale
  boardRows: string[][] = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖']
  ];


  // Array piatto aggiornabile
  cells: { piece: string, row: number, col: number }[] = [];

  updateCells() {
    this.cells = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const visualRow = this.whiteAtBottom ? 7 - r : r; // solo per il colore
        this.cells.push({
          piece: this.boardRows[r][c], // indice logico per drag & drop
          row: r,                      // riga logica
          col: c,                      // colonna logica
        });
      }
    }
  }

  drag(event: DragEvent, row: number, col: number) {
    if (!event.dataTransfer) return;

    this.draggedPiece = { row, col, piece: this.boardRows[row][col] };

    // Creiamo un elemento invisibile solo con il pezzo
    const dragIcon = document.createElement('span');
    dragIcon.textContent = this.boardRows[row][col];
    dragIcon.style.fontSize = '32px';
    dragIcon.style.position = 'absolute';
    dragIcon.style.top = '-1000px'; // fuori schermo
    document.body.appendChild(dragIcon);

    event.dataTransfer.setDragImage(dragIcon, 16, 16);

    // Rimuoviamo subito dopo per non lasciare sporcizia nel DOM
    setTimeout(() => document.body.removeChild(dragIcon), 0);
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  drop(event: DragEvent, targetRow: number, targetCol: number) {
    event.preventDefault();
    if (!this.draggedPiece) return;
    if (this.draggedPiece.row === targetRow && this.draggedPiece.col === targetCol) return;

    // Muovi il pezzo
    this.boardRows[targetRow][targetCol] = this.draggedPiece.piece;
    this.boardRows[this.draggedPiece.row][this.draggedPiece.col] = '';
    this.draggedPiece = null;

    // Aggiorna l'array piatto
    this.updateCells();
  }

  isWhiteSquare(row: number, col: number): boolean {
    return (row + col) % 2 === 0;
  }
}

