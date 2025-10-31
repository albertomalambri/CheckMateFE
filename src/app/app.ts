import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {Navbar} from './navbar/navbar';
import {Navbar2} from './navbar2/navbar2';
import {RouterModule, RouterOutlet} from '@angular/router';
import {PartitaViewComponent} from './component/partita-view/partita-view';
import {CommonModule, NgIf} from '@angular/common';
import {UserCard} from './component/user-card/user-card';
import {Strategy} from './component/strategy/strategy';
import {Messages} from './service/Messages';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, RouterOutlet, RouterModule, PartitaViewComponent, Navbar2, NgIf, UserCard, CommonModule, Strategy],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  protected readonly title = signal('CheckMateFE');
  isLoading = true;

  ngOnInit() {
    // simulazione caricamento 3 secondi
    setTimeout(() => this.isLoading = false, 3000);
  }

  constructor(public messaggiServ:Messages)
  {

  }
}
