import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  isFirstTimeUser = false;

  setFirstTimeUser(flag: boolean) {
    this.isFirstTimeUser = flag;
  }
} 