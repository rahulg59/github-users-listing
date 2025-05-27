import { CommonModule } from '@angular/common';
import { Component, ContentChild, input, TemplateRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TableColumn } from './models/table.interface';

@Component({
  selector: 'app-table',
  imports: [
    TableModule,
    CommonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  // props
  rows = input.required<any[]>();
  columns = input.required<TableColumn[]>();
  scrollableHeight = input<string>('calc(100dvh - 236px)')

  // templates
  @ContentChild('cellRenderer', {read: TemplateRef}) cellRendererTemplateRef!: TemplateRef<any>;
}
