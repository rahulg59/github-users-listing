import { Injectable } from '@angular/core';
import { SystemConfig } from '../../../core/config/system.config';
import { HttpClient } from '@angular/common/http';
import { GithubPaginatedUserResponse } from '../../models/user-info.model';

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  private baseurl: string;

  constructor(private httpClient: HttpClient) { 
    this.baseurl = SystemConfig.apiBaseUrl;
  }

  getPaginatedSearchedUsers(searchValue: string, page: number = 1) {
    return this.httpClient.get<GithubPaginatedUserResponse>(`${this.baseurl}/search/users?q=${searchValue}&page=${page}`);
  }
}
