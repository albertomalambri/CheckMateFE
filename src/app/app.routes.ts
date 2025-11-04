import { Routes } from '@angular/router';
import {Strategy} from './component/strategy/strategy';
import {PartitaViewComponent} from './component/partita-view/partita-view';
import {News} from './component/news/news';
import {Emails} from './component/emails/emails';
import {Homepage} from './component/homepage/homepage';

export const routes: Routes = [
  { path: 'partita/:id', component: PartitaViewComponent },
  { path: 'news', component: News },
  {path: 'emails', component: Emails},
  { path: 'strategy', component: Strategy },
  { path: 'partite', component: PartitaViewComponent },
  { path: '', component:Homepage }
];
 // {path: 'omosexual', component: 'gay shit'}
