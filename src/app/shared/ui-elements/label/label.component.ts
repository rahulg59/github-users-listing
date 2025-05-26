import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  imports: [],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss'
})
export class LabelComponent {
  @Input() type: 'p' | 'title' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'p';
}
