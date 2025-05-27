import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SearchHistoryService } from '../../global-utils/services/search-history.service';
import { UserSearchHistoryModel } from '../../models/search-history.model';
import { of } from 'rxjs';

export const searchHistoryResolver: ResolveFn<UserSearchHistoryModel[]> = (route, state) => {
  const historyService = inject(SearchHistoryService);
  return historyService.getItems();
};
