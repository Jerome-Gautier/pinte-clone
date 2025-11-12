import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this._isAuthenticated.asObservable();

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem('auth_token', token);
      this._isAuthenticated.next(true);
    } else {
      localStorage.removeItem('auth_token');
      this._isAuthenticated.next(false);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout() {
    this.setToken(null);
  }
}
