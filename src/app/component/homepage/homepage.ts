import {Component, HostListener, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {User} from '../../model/user.model';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-homepage',
  imports: [
    RouterLink
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage implements OnInit{
  footerVisible = false;
  isLoggedIn = true; // simulazione
  user: User | null = null;

  constructor(private userService: AuthService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (u) => {
        this.user = u;
        console.log("✅ Utente caricato:", this.user);
      },
      error: (err) => console.error("❌ Errore caricamento utente:", err)
    });
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.body.scrollHeight;

    // mostra footer quando sei vicino al fondo (50px di margine)
    this.footerVisible = scrollTop + windowHeight >= docHeight - 50;
  }


}
