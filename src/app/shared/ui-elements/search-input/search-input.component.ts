import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext'

@Component({
  selector: 'app-search-input',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {
  // props
  value = model.required<string>();
  placeholder = input<string>();

  // event emitters
  @Output() onSearch: EventEmitter<string> = new EventEmitter();

  onSubmit(event: KeyboardEvent) {
    if(event.key == "Enter") {
      this.onSearch.emit(this.value())
    }
  }
}
