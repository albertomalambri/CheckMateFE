import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PartitaViewComponent} from './component/partita-view/partita-view';

@Component({
  selector: 'app-root',
  imports: [PartitaViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('CheckMateFE');
}
