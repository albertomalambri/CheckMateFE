import { Routes } from '@angular/router';
import {Strategy} from './component/strategy/strategy';
import {PartitaViewComponent} from './component/partita-view/partita-view';
import {News} from './component/news/news';

export const routes: Routes = [
  { path: 'partita/:id', component: PartitaViewComponent },
  { path: 'news', component: News }
];
