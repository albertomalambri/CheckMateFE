import { Component, HostListener } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-homepage',
  imports: [
    RouterLink
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {
  footerVisible = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.body.scrollHeight;

    // mostra footer quando sei vicino al fondo (50px di margine)
    this.footerVisible = scrollTop + windowHeight >= docHeight - 50;
  }

  isLoggedIn = true; // per ora simuliamo l'utente loggato


}
