import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Partita } from '../model/partita.model';

@Injectable({ providedIn: 'root' })
export class PartitaService {
  private baseUrl = '/api/partita';

  constructor(private http: HttpClient) {}

  startPartita(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/start`, {});
  }

  getPartita(): Observable<Partita> {
    // Se vuoi puoi anche mappare start come “get partita corrente”
    return this.http.post<Partita>(`${this.baseUrl}/start`, {});
  }
}
