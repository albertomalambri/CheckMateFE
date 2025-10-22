import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {Navbar} from './navbar/navbar';
import {RouterModule, RouterOutlet} from '@angular/router';
import {PartitaViewComponent} from './component/partita-view/partita-view';
import {Navbar2} from './navbar2/navbar2';
import {ChessBoardComponent}  from './component/chess-board/chess-board';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, RouterOutlet, RouterModule, PartitaViewComponent, Navbar2, ChessBoardComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  protected readonly title = signal('CheckMateFE');
  chessBoard: any;
}
