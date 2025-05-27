import { Component, inject, signal } from '@angular/core';
import { LabelComponent } from "../../shared/ui-elements/label/label.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TableComponent } from "../../shared/ui-elements/table/table.component";
import { UserSearchHistoryModel } from '../../shared/models/search-history.model';
import { SearchHistoryTableListConfig } from './config/search-history-table.config';
import { UserCardComponent } from "../../shared/ui-elements/user-card/user-card.component";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SearchHistoryService } from '../../shared/global-utils/services/search-history.service';

@Component({
  selector: 'app-seach-history',
  imports: [
    LabelComponent, 
    TableComponent, 
    UserCardComponent,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './seach-history.component.html',
  styleUrl: './seach-history.component.scss'
})
export class SeachHistoryComponent {

  // data
  searchHistoryRows = signal<UserSearchHistoryModel[]>([]);

  // config
  searchHistoryTableColumns = SearchHistoryTableListConfig;

  // injectors
  private searchHistoryService = inject(SearchHistoryService);

  constructor(private activatedRoute: ActivatedRoute) {
    const searchHistoryList = activatedRoute.snapshot.data['history'];
    this.searchHistoryRows.set(searchHistoryList);
  }

  // events
  clearSearchHistory() {
    this.searchHistoryService.clearHistory();
    this.searchHistoryRows.set([]);
  }
}
