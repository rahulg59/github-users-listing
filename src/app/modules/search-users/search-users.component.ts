import { Component, computed, inject, model, signal } from '@angular/core';
import { LabelComponent } from "../../shared/ui-elements/label/label.component";
import { SearchInputComponent } from "../../shared/ui-elements/search-input/search-input.component";
import { MatButtonModule } from '@angular/material/button';
import { GithubApiService } from '../../shared/_http/services/github-api.service';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProgressBarModule } from 'primeng/progressbar';
import { UserCardComponent } from "../../shared/ui-elements/user-card/user-card.component";
import { SystemConfig } from '../../core/config/system.config';

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
export class SearchUsersComponent {
  searchValue = signal<string>('');
  searchedQuery = signal<string>('');
  users = signal<any[]>([]);
  page = signal(1);
  totalCount = signal(0);
  isLoading = signal(false);
  isNoDataFound = signal(true);
  isError = signal(false);

  // injectors
  private githubService = inject(GithubApiService);

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

  // logic layer
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
        this.page.set(this.page() + 1);
        this.isError.set(false);
        this.isLoading.set(false);
        this.searchedQuery.set(this.searchValue());
      }, error => {
        // clear data on api fail
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
