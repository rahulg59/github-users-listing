import { computed, Injectable, signal } from '@angular/core';
import { UserSearchHistoryModel } from '../../models/search-history.model';
import { EncryptedStorage } from '../custom-libraries/encrypted-storage';
import { StorageConfigNS } from '../../../core/config/storage.config';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {

  private storedUserSearchHistory = signal<UserSearchHistoryModel[]>([]);
  private encryptedStorage = new EncryptedStorage();

  // computed for output
  public userSearchHistory = computed(() => {
    return this.storedUserSearchHistory();
  })

  constructor() { 
    // refresh signal from localstorage on load of this service
    this.getItems();
  }

  getItems() {
    const storedUserSearchList = this.encryptedStorage.getItem(StorageConfigNS.SeearchHistory);
    if(storedUserSearchList) {
      this.storedUserSearchHistory.set(storedUserSearchList);
      return this.userSearchHistory();
    } else {
      // if no storage found then create one
      this.createNewStorage();
      return []
    }
  }

  addResultToSearchHistory(data: UserSearchHistoryModel) {
    this.storedUserSearchHistory.update((items) => {
      if(!!!items.find(item => item.searchTerm == data.searchTerm)) {
        // check duplicate item with search term
        const newList = [...items, {...data}];
        this.encryptedStorage.setItem(StorageConfigNS.SeearchHistory, newList);
        return newList;
      } else {
        return [...items];
      }
    });
  }

  clearHistory() {
    this.encryptedStorage.removeItem(StorageConfigNS.SeearchHistory);
    this.createNewStorage();
  }

  createNewStorage() {
    this.encryptedStorage.setItem(StorageConfigNS.SeearchHistory, []);
  }
}
