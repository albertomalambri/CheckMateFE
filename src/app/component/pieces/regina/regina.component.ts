import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-regina',
  standalone: true,
  imports: [],
  templateUrl: './regina.component.html',
  styleUrl: './regina.component.css'
})
export class ReginaComponent {
  @Input() color: 'white' | 'black' = 'white';
}
