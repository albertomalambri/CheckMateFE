import {Pezzo} from './pezzo.model';


export interface Mossa
{
  numero: number
  da: string;
  a: string;
  pezzo: string;
  cattura?: boolean;
  arrocco?: boolean;
  promozione?: boolean;
  pezzoPromozione:string;
}
export interface cellaDTO{
  row: number;
  column: number;
  colorePezzo: string;
  pezzo: string;
  nomeCasella: string;
}
export interface ScacchieraGameStateDTO {
  id:number;
  scacchiera: cellaDTO[][];
  currentPlayer: string;
  isCheck:boolean;
  isCheckMate:boolean;
  isStallo : boolean;
}
export interface Partita
{
  id: number;
  gameStateId: number;
  giocatoreBianco: string;
  giocatoreNero: string;
  risultato: string;
  statoFinaleFEN: string;
  mosse: Mossa[];
  scacchiera?: (Pezzo | null)[][];
}
