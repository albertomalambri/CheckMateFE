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

  constructor(private authService: AuthService) {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-avatar')) {
        this.showAvatarSelector = false;
      }
    });
  }

  ngOnInit(): void {
    this.user$ = this.authService.currentUser$; // ci sottoscriviamo al BehaviorSubject
  }

  // Avatar predefiniti
  availableAvatars: string[] = [
    'https://i.pinimg.com/564x/9a/17/24/9a1724fff30405990d75cbe8b4d8e065.jpg',
    'https://cdn-useast1.kapwing.com/static/templates/devastated-wet-cat-meme-maker-full-4f71f324.webp',
    'https://media.tenor.com/_zWYqfZdneIAAAAM/shocked-face-shocked-meme.gif',
    'https://m.media-amazon.com/images/I/813kqvYoRfL.png',
    'https://i.postimg.cc/xCr3Zb4j/Whats-App-Image-2025-10-27-at-10-42-37.jpg',
    'https://i.postimg.cc/D04FwHcJ/Whats-App-Image-2025-10-17-at-12-39-47.jpg'
  ];

  defaultAvatar = 'https://i.postimg.cc/xCr3Zb4j/Whats-App-Image-2025-10-27-at-10-42-37.jpg';
  selectedAvatar: string | null = null;
  showAvatarSelector = false;

  toggleAvatarSelector(): void {
    this.showAvatarSelector = !this.showAvatarSelector;
  }

  changeAvatar(url: string, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedAvatar = url;
    this.showAvatarSelector = false;
  }
}
