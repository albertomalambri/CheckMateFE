import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MessageModel} from '../../model/Message.model';
import {MessagesService} from '../../service/Message.service';

@Component({
  selector: 'app-emails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emails.html',
  styleUrls: ['./emails.css']
})
export class Emails {
  messages: MessageModel[] = [];

  constructor(private messagesService: MessagesService) {
    this.messagesService.messages$.subscribe((list: MessageModel[]) =>{
      this.messages = list;
    });
  }

  markAllRead() {
    console.log('Chiamato!');
    this.messagesService.markAllRead();
  }

}
