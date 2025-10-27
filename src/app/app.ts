import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {Navbar} from './navbar/navbar';
import {Navbar2} from './navbar2/navbar2';
import {RouterModule, RouterOutlet} from '@angular/router';
import {PartitaViewComponent} from './component/partita-view/partita-view';
import {NgIf} from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, RouterOutlet, RouterModule, PartitaViewComponent, Navbar2, NgIf],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  protected readonly title = signal('CheckMateFE');
  loading = true;

  ngOnInit() {
    // Simula il caricamento del sito (puoi sostituire con reali chiamate HTTP)
    setTimeout(() => {
      this.loading = false;
    }, 1500); // 1.5 secondi, cambia a piacere
  }
}
