import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-pedone',
  standalone: true,
  imports: [],
  templateUrl: './pedone.component.html',
  styleUrl: './pedone.component.css'
})
export class PedoneComponent {
  @Input() color: 'white' | 'black' = 'white';
}
