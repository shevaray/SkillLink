import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  isFirstTimeUser = true;

  setFirstTimeUser(flag: boolean) {
    this.isFirstTimeUser = flag;
  }
} 