import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInformationService {
  
  private storageKey = 'account';

  constructor() {}

  setAccount(data: any): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getAccount(): any {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  removeAccount(): void {
    localStorage.removeItem(this.storageKey);
  }
}
