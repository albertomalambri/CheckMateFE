import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private rssUrl = 'https://www.chess.com/news/rss';

  constructor(private http: HttpClient) {}

  getNews(): Observable<any[]> {
    return this.http.get('/chessnews/news/rss', { responseType: 'text' }).pipe(
      map((rss) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(rss, 'application/xml');
        const items = Array.from(xml.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title')?.textContent,
          link: item.querySelector('link')?.textContent,
          pubDate: item.querySelector('pubDate')?.textContent,
          description: item.querySelector('description')?.textContent,
        }));
        return items;
      })
    );
  }
}
