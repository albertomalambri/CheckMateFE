import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from '../service/auth.service';
import {User} from '../model/user.model';
import {RouterLink, RouterLinkActive} from '@angular/router';



@Component({
  selector: 'app-navbar2',
  templateUrl: './navbar2.html',
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
  ],
  styleUrls: ['./navbar2.css']
})
export class Navbar2{
  isLoggedIn = false;
  username = '';

  // Variabili per modals
  isLoginOpen = false;
  isRegisterOpen = false;

  // Form inputs
  loginUsername = '';
  loginPassword = '';
  registerUsername = '';
  registerEmail = '';
  registerPassword = '';

  apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private authService: AuthService) {
    // Sottoscrizione al BehaviorSubject per aggiornare subito lo stato locale
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.username = user.username;
        this.isLoggedIn = true;
      } else {
        this.username = '';
        this.isLoggedIn = false;
      }
    });
  }


  openLogin() {
    this.isLoginOpen = true;
    this.isRegisterOpen = false;
  }

  openRegister() {
    this.isRegisterOpen = true;
    this.isLoginOpen = false;
  }

  closeModals() {
    this.isLoginOpen = false;
    this.isRegisterOpen = false;
  }

  submitLogin() {
    if (!this.loginUsername || !this.loginPassword) return;

    this.http.post<User>(
      `${this.apiUrl}/login`,
      { username: this.loginUsername, password: this.loginPassword },
      { withCredentials: true }
    ).subscribe({
      next: (res) => {
        if (res && res.username) {
          this.authService.setUser(res); // aggiorna BehaviorSubject
          this.closeModals();
        }
      },
      error: (err) => console.error(err)
    });
  }

  submitRegister() {
    if (!this.registerUsername || !this.registerEmail || !this.registerPassword) return;

    this.http.post<{ username: string }>(`${this.apiUrl}/register`, {
      username: this.registerUsername?.trim(),
      email: this.registerEmail?.trim(),
      password: this.registerPassword?.trim()
    }, { withCredentials: true }).subscribe({
      next: (res) => {
        // Se res è solo token
        const user = { username: this.registerUsername, token: res };
        localStorage.setItem('user', JSON.stringify(user));
        this.username = user.username;
        this.isLoggedIn = true;
        this.closeModals();
      },
      error: (err) => {
        console.error('Registrazione fallita', err);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.authService.setUser(null);
    this.isLoggedIn = false;
    this.username = '';
  }

}
