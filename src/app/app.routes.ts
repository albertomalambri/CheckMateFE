import { Routes } from '@angular/router';
import {Strategy} from './component/strategy/strategy';
import {PartitaViewComponent} from './component/partita-view/partita-view';
import {News} from './component/news/news';
import {Homepage} from './component/homepage/homepage';

export const routes: Routes = [
  { path: 'partita/:id', component: PartitaViewComponent },
  { path: 'news', component: News },
  { path: '', component:Homepage },
  { path: 'partite', component: PartitaViewComponent },
  { path: 'strategy', component: Strategy }
];
