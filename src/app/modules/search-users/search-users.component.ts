import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { LabelComponent } from "../../shared/ui-elements/label/label.component";
import { SearchInputComponent } from "../../shared/ui-elements/search-input/search-input.component";
import { MatButtonModule } from '@angular/material/button';
import { GithubApiService } from '../../shared/_http/services/github-api.service';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProgressBarModule } from 'primeng/progressbar';
import { UserCardComponent } from "../../shared/ui-elements/user-card/user-card.component";
import { SystemConfig } from '../../core/config/system.config';
import { MessageService } from 'primeng/api';
import { UserInfoModel } from '../../shared/models/user-info.model';
import { SearchHistoryService } from '../../shared/global-utils/services/search-history.service';
import { UserSearchHistoryModel } from '../../shared/models/search-history.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-users',
  imports: [
    LabelComponent,
    SearchInputComponent,
    MatButtonModule,
    ScrollingModule,
    ProgressBarModule,
    CommonModule,
    UserCardComponent
  ],
  templateUrl: './search-users.component.html',
  styleUrl: './search-users.component.scss'
})
export class SearchUsersComponent implements OnInit {
  searchValue = signal<string>('');
  searchedQuery = signal<string>('');
  users = signal<UserInfoModel[]>([]);
  page = signal(1);
  totalCount = signal(0);
  isLoading = signal(false);
  isNoDataFound = signal(true);
  isError = signal(false);

  // injectors
  private githubService = inject(GithubApiService);
  private searchHistoryService = inject(SearchHistoryService);
  private toasty = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // computed
  resultListTitle = computed(() => {
    if(this.searchedQuery()) {
      if(this.isNoDataFound()) {
        return "No Data Found";
      } else if(this.isError()) {
        return 'Error: API Call Failed'  
      } else {
        return `Search Results (${this.totalCount()} users found)`
      }
    } else if(this.isLoading()) {
      return 'Loading...'
    } else if(this.isError()) {
      return 'Error: API Call Failed'
    }
    return ''
  });

  showUserList = computed(() => {
    return (this.users() && this.users().length > 0) || (this.totalCount() && this.totalCount() > 0)
  })

  // lifecycle events
  ngOnInit(): void {
    this.checkURLQueryParams()
  }

  // logic layer
  checkURLQueryParams() {
    const query = this.activatedRoute.snapshot.queryParamMap.get('searchTerm');
    if(query) {
      this.searchValue.set(query);
      this.triggerSearch();
      // clear query params after search triggered
      this.router.navigate(["/search"])
    }
  }


  loadUsers() {
    if(this.searchValue()) {
      if (this.isLoading() || (this.totalCount() && this.users().length >= this.totalCount())) {
        // skip api call;
        return;
      };

      this.isLoading.set(true);

      this.githubService.getPaginatedSearchedUsers(this.searchValue(), this.page()).subscribe(res => {
        
        this.users.update(current => [...current, ...res.items]);
        this.totalCount.set(res.total_count);

        if(res.total_count == 0) {
          this.isNoDataFound.set(true);
        } else {
          this.isNoDataFound.set(false);
        }
        if(this.page() == 1) {
          // set history only with first page call
          const newHistoryItem: UserSearchHistoryModel = {
            searchTerm: this.searchValue(),
            countOfFoundUsers: res.total_count,
            firstUserItem: this.users().length > 0 ? this.users()[0] : null
          }
          this.searchHistoryService.addResultToSearchHistory(newHistoryItem);
        }
        this.page.set(this.page() + 1);
        this.isError.set(false);
        this.isLoading.set(false);
        this.searchedQuery.set(this.searchValue());
      }, error => {
        // clear data on api fail
        this.toasty.add({ summary: "Github API:", detail: error?.error?.message || "API Failed", severity: "error", closable: true})
        this.users.set([]);
        this.page.set(1);
        this.totalCount.set(0);
        this.isLoading.set(false);
        this.isError.set(true);
        this.searchedQuery.set(this.searchValue());
      });
    } else {
      // clear data on empty request
      this.totalCount.set(0);
      this.users.set([]);
      this.isNoDataFound.set(true);
      this.searchedQuery.set('');
    }
  }

  // events
  triggerSearch() {
    // reset user data and pagination for every new search
    this.users.set([]);
    this.page.set(1);
    this.loadUsers();
  }

  onScroll(index: number) {
    const buffer = SystemConfig.paginationBufferLength;
    if (index + buffer >= this.users().length) {
      this.loadUsers();
    }
  }
}
