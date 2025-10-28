import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-cavallo',
  standalone: true,
  imports: [],
  templateUrl: './cavallo.component.html',
  styleUrl: './cavallo.component.css'
})
export class CavalloComponent {
  @Input() color: 'white' | 'black' = 'white';
}
