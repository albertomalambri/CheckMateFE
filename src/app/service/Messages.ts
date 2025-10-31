import {Injectable} from '@angular/core';
import {Message} from '../model/Message';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Messages
{
  messages:Message[] = [];

  constructor(private http:HttpClient)
  {
    //li leggo subito
    this.leggiMessaggiBackend()
    //poi li refresho ogni 5 secondi
    setInterval
    (
      ()=>this.leggiMessaggiBackend,
      3000
    );

  }

  leggiMessaggiBackend()
  {
    let usernameUtenteRegistrato = "pluto";
    this.http.get<Message[]>("/api/messages/"+usernameUtenteRegistrato)
      .subscribe((messaggi)=>this.messages=messaggi)
  }
}
