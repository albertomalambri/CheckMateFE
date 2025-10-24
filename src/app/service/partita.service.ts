import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Partita } from '../model/partita.model';

@Injectable({ providedIn: 'root' })
export class PartitaService {
  private baseUrl = 'http://localhost:8080/api/mock';

  constructor(private http: HttpClient) {}

  startPartita(): Observable<Partita> {
    return this.http.post<Partita>(`${this.baseUrl}/start`, {});
  }

  getPartita(): Observable<Partita> {
    // Se vuoi puoi anche mappare start come “get partita corrente”
    return this.http.post<Partita>(`${this.baseUrl}/start`, {});
  }
}
