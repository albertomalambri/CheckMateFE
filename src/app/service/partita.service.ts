import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import {Mossa, Partita, ScacchieraGameStateDTO} from '../model/partita.model';

@Injectable({ providedIn: 'root' })
export class PartitaService {
  private baseUrl = '/api/partita';

  constructor(private http: HttpClient) {
  }

  startPartita(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/start`, {}, {withCredentials: true});
  }

  getPartita(): Observable<Partita> {
    // Se vuoi puoi anche mappare start come “get partita corrente”
    return this.http.post<Partita>(`${this.baseUrl}/start`, {}, {withCredentials: true});
  }

  eseguiMossa(id: number | undefined, mossa: Mossa): Observable<ScacchieraGameStateDTO> {
    if (!id) {
      console.error('⚠️ ID partita mancante.');
      return throwError(() => new Error('ID partita mancante'));
    }
    return this.http.post<ScacchieraGameStateDTO>(`${this.baseUrl}/mossa/${id}`, mossa, {withCredentials: true});
  }

  finePartita(id: number | undefined) {
    return this.http.get<Partita>(`/stato/${id}`, {withCredentials: true})
  }
}
