import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {
  private userKey = 'currentUser';

  constructor() {}

  setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
  }
}
