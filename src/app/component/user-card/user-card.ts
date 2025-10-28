import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService, User} from '../../service/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-card.html',
  styleUrls: ['./user-card.css']
})
export class UserCard {
  user$!: Observable<User | null>; // flusso reattivo dell’utente

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.authService.currentUser$; // ci sottoscriviamo al BehaviorSubject
  }
}
