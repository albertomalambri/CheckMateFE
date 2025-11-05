import {Partita} from './partita.model';

export interface User {
  id: string;
  username: string;
  email?: string;
  token?: string;
  rank?: string;
  elo?: number;
  partiteGiocate?: number;
  winRate?: number;
  role?: string;
  avatar?: string;

  partite?: Partita[];
}
