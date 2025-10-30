import { Routes } from '@angular/router';
import {Strategy} from './component/strategy/strategy';
import {PartitaViewComponent} from './component/partita-view/partita-view';

export const routes: Routes = [
  { path: 'partita/:id', component: PartitaViewComponent }
];
