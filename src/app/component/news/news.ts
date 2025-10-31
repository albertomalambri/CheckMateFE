import {Component, OnInit} from '@angular/core';
import {NewsService} from '../../service/NewsService';
import {CommonModule, DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule
  ],
  templateUrl: './news.html',
  styleUrls: ['./news.css']
})
export class News implements OnInit{
  news: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.news = [
      {
        title: 'Campionato Mondiale 2025',
        url: 'https://it.wikipedia.org/wiki/Coppa_del_Mondo_di_scacchi_2025',
        pubDate: new Date('2025-10-31T09:00:00'),
        description: 'Il Campionato Mondiale di scacchi 2025 è iniziato con partite mozzafiato tra i migliori grandi maestri.',
        imageUrl: 'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/Miyuki97/phpHZoHpf.jpg'
      },
      {
        title: 'Nuova apertura: Variante Dragon',
        url: 'https://www.chess.com/openings/Sicilian-Defense-Open-Dragon-Levenfish-Variation',
        pubDate: new Date('2025-10-30T15:30:00'),
        description: 'Scopri la nuova strategia della Variante Dragon, sempre più popolare nei tornei internazionali.',
        imageUrl: 'https://cdn.shopify.com/s/files/1/0621/7859/0879/files/Sicilian-defence-dragon-variation_480x480.webp?v=1681888103'
      },
      {
        title: 'Intervista al Grande Maestro Magnus Carlsen',
        url: 'https://www.chess.com/it/news/view/carlsen-sui-candidati-intervista',
        pubDate: new Date('2025-10-29T12:00:00'),
        description: 'Analisi delle ultime partite e consigli esclusivi dai migliori giocatori del mondo.',
        imageUrl: 'https://www.scacchierando.it/wp-content/uploads/2021/03/Carlsen_Avvenire.jpg'
      },
      {
        title: 'Torneo Online Lichess Open',
        url: 'https://lichess.org/it/broadcast',
        pubDate: new Date('2025-10-28T18:00:00'),
        description: 'Il torneo online Lichess Open ha registrato un record di partecipanti: oltre 50.000 giocatori iscritti.',
        imageUrl: 'https://i0.wp.com/amedeofavitta.wordpress.com/wp-content/uploads/2021/12/lichess-1.png?fit=1200%2C554&ssl=1&w=640'
      },
      {
        title: 'FIDE Introduce Nuove Regole per Rapid',
        url: 'https://handbook.fide.com/chapter/B02RBRegulations2024',
        pubDate: new Date('2025-10-27T10:00:00'),
        description: 'La FIDE ha aggiornato le regole ufficiali per il gioco rapido, con novità sulle penalità e tempistiche.',
        imageUrl: 'https://www.scacchierando.it/wp-content/uploads/2023/07/Effetti_Bonus_Elo_FIDE_2024.jpg'
      },
      {
        title: 'Analisi delle Migliori Partite della Settimana',
        url: 'https://it.hobby.scacchi.narkive.com/VPXDWUe4/principiante-programma-analisi-per-imparare-come-analizzare-le-varianti',
        pubDate: new Date('2025-10-26T14:00:00'),
        description: 'Un riepilogo delle partite più emozionanti e delle mosse più strategiche della settimana.',
        imageUrl: 'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/Miyuki97/phpH5ngHp.png'
      },
      {
        title: 'Scacchi e Tecnologia: Nuovi Software di Allenamento',
        url: 'https://www.insalutenews.it/in-salute/lia-trasforma-gli-scacchi-in-una-lezione-ora-capiremo-il-perche-di-ogni-mossa/',
        pubDate: new Date('2025-10-25T16:30:00'),
        description: 'I software di allenamento stanno rivoluzionando il modo di prepararsi ai tornei, con intelligenza artificiale e analisi avanzata.',
        imageUrl: 'https://ilsaltodirodi.com/wp-content/uploads/2017/12/apertura.jpg?w=1024'
      },
      {
        title: 'Intervista a Fabiano Caruana',
        url: 'https://www.chess.com/news/view/2025-us-championship-round-9',
        pubDate: new Date('2025-10-24T11:00:00'),
        description: 'Il grande maestro americano parla delle sue strategie e della preparazione mentale necessaria per competere ai massimi livelli.',
        imageUrl: 'https://preview.redd.it/happy-31st-birthday-to-fabiano-caruana-v0-0eht1ru7v2fb1.jpg?width=640&crop=smart&auto=webp&s=720300d71364d980e4c237bb37c527df4a5ca849'
      },
      {
        title: 'Storia degli Scacchi: dai Classici ai Moderni',
        url: 'https://it.wikipedia.org/wiki/Storia_degli_scacchi',
        pubDate: new Date('2025-10-23T09:30:00'),
        description: 'Un viaggio attraverso la storia degli scacchi, dai maestri classici alle innovazioni moderne.',
        imageUrl: 'https://i0.wp.com/unoscacchista.com/wp-content/uploads/2018/11/partida-de-ajedrez-e1543161124262.jpg?fit=640%2C440&ssl=1'
      },
      {
        title: 'Eventi Locali di Scacchi: Tornei Autunnali',
        url: 'https://www.federscacchi.com/fsi/index.php/calendario/calendario?tipo_evento=&den=&reg=&pro=&dtiniric=&dtfinric=&ord=1&senso=Asc&ric=1',
        pubDate: new Date('2025-10-22T13:00:00'),
        description: 'Una lista di tornei locali e internazionali che si svolgeranno questo autunno per tutti gli appassionati.',
        imageUrl: 'https://www.bresciascacchi.it/wp-content/uploads/2025/05/Torneo_Scacchi_Accademia_Maggio-24.jpg'
      }
    ];

    setTimeout(() => this.loading = false, 1000);
  }
}
