import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {provideRouter, Routes} from '@angular/router';
import { AppComponent } from './app/app';
import {PartitaViewComponent} from './app/component/partita-view/partita-view';
import {Homepage} from './app/component/homepage/homepage';

const routes: Routes = [
  { path: '', component:Homepage },
  { path: 'partite', component: PartitaViewComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)  // 👈 aggiunto qui
  ]
});
