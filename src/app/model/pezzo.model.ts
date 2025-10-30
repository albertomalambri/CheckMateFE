export interface Pezzo {
  pezzo: 'PEDONE' | 'TORRE' | 'CAVALLO' | 'ALFIERE' | 'REGINA' | 'RE';
  colorePezzo: 'BIANCO' | 'NERO';
}
export enum PezzoCodice {
  ALFIERE = 'AL',
  PEDONE = 'PE',
  REGINA = 'RG',
  RE = 'RE',
  TORRE = 'TO',
  CAVALLO = 'CA'
}
