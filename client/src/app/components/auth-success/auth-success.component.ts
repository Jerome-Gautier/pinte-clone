import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-success',
  standalone: true,
  imports: [],
  template: `
  <div class="success-container">
    <p>Authentication successful!</p>
  </div>
  `,
  styles: `
    .success-container {
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      padding: 16px;
      background: #e6ffed;
      border: 1px solid #b2f2bb;
      border-radius: 8px;
      color: #155724;
      z-index: 2000;
    }
  `
})
export class AuthSuccessComponent {
  token: string | null = null;

  constructor(private auth: AuthService, private router: Router) {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    this.token = token;

    if (token) {
      // primary: use AuthService
      this.auth.setToken(token);

      // fallback: directly write to localStorage to handle any DI/instance mismatch during debugging
      try {
        window.localStorage.setItem('auth_token', token);
      } catch (err) {
        console.warn('Failed to write token to localStorage directly', err);
      }

      setTimeout(() => {
        this.router.navigateByUrl('/');
      }, 2500);
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
