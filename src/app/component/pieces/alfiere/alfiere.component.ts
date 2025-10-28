import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-alfiere',
  standalone: true,
  imports: [],
  templateUrl: './alfiere.component.html',
  styleUrl: './alfiere.component.css'
})
export class AlfiereComponent {
  @Input() color: 'white' | 'black' = `white`;
}
