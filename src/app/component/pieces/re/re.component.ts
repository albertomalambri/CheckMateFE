import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-re',
  standalone: true,
  imports: [],
  templateUrl: './re.component.html',
  styleUrl: './re.component.css'
})
export class ReComponent {
  @Input() color: 'white' | 'black' = 'white';
}
