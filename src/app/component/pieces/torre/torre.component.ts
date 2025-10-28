import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-torre',
  standalone: true,
  imports: [],
  templateUrl: './torre.component.html',
  styleUrl: './torre.component.css'
})
export class TorreComponent {
  @Input() color: 'white' | 'black' = 'white';
}
