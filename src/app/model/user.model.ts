export interface User {
  id: number;
  username: string;
  email?: string;
  token?: string;
  rank?: string;
  elo?: number;
  partiteGiocate?: number;
  winRate?: number;
  role?: string;
  avatar?: string;
}
