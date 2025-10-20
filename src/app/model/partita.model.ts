export interface Mossa
{
  numero: number;
  da: string;
  a: string;
  pezzo: string;
  cattura: boolean;
  arrocco: boolean;
  promozione: boolean;
}

export interface Partita
{
  id: number;
  giocatoreBianco: string;
  giocatoreNero: string;
  risultato: string;
  statoFinaleFEN: string;
  mosse: Mossa[];
}
