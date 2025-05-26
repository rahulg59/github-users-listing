import { Injectable } from '@angular/core';
import { SystemConfig } from '../../../core/config/system.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  private baseurl: string;

  constructor(private httpClient: HttpClient) { 
    this.baseurl = SystemConfig.apiBaseUrl;
  }

  getPaginatedSearchedUsers(searchValue: string, page: number = 1) {
    return this.httpClient.get<any>(`${this.baseurl}/search/users?q=${searchValue}&page=${page}`, {
      headers: new HttpHeaders({
        Authorization: `token ${atob(SystemConfig.gitAccessToken)}`
      })
    });
  }
}
