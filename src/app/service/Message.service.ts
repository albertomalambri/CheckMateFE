import {Injectable} from '@angular/core';
import {MessageModel} from '../model/Message.model';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  // messages:MessageModel[] = []; lo potremmo scrivere anche così
  // ma lo vogliamo rendere un Observable, quindi lo scriviamo con BehaviorSubject
  // che è un tipo di Observable

  private messagesSubject = new BehaviorSubject<MessageModel[]>([]);
  messages$ = this.messagesSubject.asObservable();


  constructor(private http: HttpClient, private auth: AuthService) {
    //li leggo subito
    this.leggiMessaggiBackend()
    //poi li refresho ogni 3 secondi(polling)
    setInterval
    (
      () => this.leggiMessaggiBackend(),
      10000
    );

  }

  leggiMessaggiBackend() {
    const user = this.auth.currentUser;
    if (!user || !user.username) {
      return; // utente non pronto
    }
    const username = encodeURIComponent(user.username);
    this.http.get<MessageModel[]>(`/api/messages/${username}`)
      .subscribe({
        next: messaggi => this.messagesSubject.next(messaggi),
        error: () => this.messagesSubject.next([])
      });
  }

  markAllRead() {
    const aggiornati = this.messagesSubject.value.map(m => ({ ...m, read: true }));
    this.messagesSubject.next(aggiornati);
  }

}
