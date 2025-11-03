import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, switchMap, tap} from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth'; //
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // ================= LOGIN =================
  login(username: string, password: string) {
    return this.http
      .post<void>(`${this.apiUrl}/login`, { username, password }, { withCredentials: true })
      .pipe(
        switchMap(() =>
          this.http.get<User>(`${this.apiUrl}/userinformation`, { withCredentials: true })
        ),
        tap(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user); // <- qui va bene
        })
      );
  }

  // ================= REGISTER =================
  register(username: string, email: string, password: string) {
    return this.http
      .post<User>(`${this.apiUrl}/register`, { username, email, password }, { withCredentials: true })
      .pipe(
        tap(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  // ================= LOGOUT =================
  logout(): void {
    this.http.post('/api/auth/logout', {}, { withCredentials: true })
      .subscribe(() => {
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
      });
  }


  // ================= GET CURRENT USER =================
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // ================= IS LOGGED IN =================
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  setUser(user: User | null) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(user);
  }

}
