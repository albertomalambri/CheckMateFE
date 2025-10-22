import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Square {
  row: number;      // 0..7
  col: number;      // 0..7
  coord: string;    // "a1" etc.
  color: 'white'|'black';
  piece?: string;   // rappresentazione semplice del pezzo (es. "♙", "♖", "bP", "wp", ecc.)
}

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [],
  templateUrl: './chess-board.html',
  styleUrls: ['./chess-board.css']
})
export class ChessBoardComponent {

  @Input() showCoords: boolean = true;              // mostra coordinate sui bordi
  @Input() piecesMap: Record<string, string> = {};  // es: { "e2": "♙", "a1": "♖" }
  @Output() squareClick = new EventEmitter<Square>();

  board: Square[][] = [];

  columns = Array.from({ length: 8 }, (_, i) =>
    String.fromCharCode('a'.charCodeAt(0) + i)
  );

  constructor() {
    this.initBoard();
  }

  // inizializza la matrice 8x8
  initBoard(): void {
    this.board = [];
    for (let r = 7; r >= 0; r--) {   // r=7 in alto (8), r=0 in basso (1) -> scelta per la visuale "standard"
      const row: Square[] = [];
      for (let c = 0; c < 8; c++) {
        const coord = ChessBoardComponent.positionToString(r, c);
        const color: 'white'|'black' = ((r + c) % 2 === 0) ? 'white' : 'black';
        row.push({
          row: r,
          col: c,
          coord,
          color,
          piece: this.piecesMap[coord] ?? undefined
        });
      }
      this.board.push(row);
    }
  }

  // helper pubblico se vuoi aggiornare i pezzi dall'esterno
  public setPieces(pieces: Record<string,string>) {
    this.piecesMap = pieces || {};
    // aggiorna le caselle esistenti
    for (const row of this.board) {
      for (const sq of row) {
        sq.piece = this.piecesMap[sq.coord] ?? undefined;
      }
    }
  }

  onSquareClick(sq: Square) {
    this.squareClick.emit(sq);
  }

  // converte indici (0..7) in notazione scacchistica, riga 0->"1", col 0->'a'
  static positionToString(row: number, column: number): string {
    const colLetter = String.fromCharCode('a'.charCodeAt(0) + column);
    // row nella nostra board è 0..7, ma qui vogliamo notazione 1..8
    const rank = (row + 1).toString();
    return `${colLetter}${rank}`;
  }
}

