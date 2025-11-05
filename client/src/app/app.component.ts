import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GridComponent } from './components/grid/grid.component';
import { ImagesService } from './services/images.service';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

const AUTH_URL = '/auth/github';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, GridComponent, RouterOutlet],
  template: `
    <app-navbar
      [selected]="selected"
      (selectAllClick)="onSelectAllClick()"
      (selectFavoritesClick)="onSelectFavoritesClick()"
      (selectMyPicsClick)="onSelectMyPicsClick()"
      (onAddImageClick)="onAddImageClick($event.url, $event.title)"
      (loginRedirect)="loginRedirect()"
      (logout)="logout()"
      [isLoggedIn]="isLoggedIn"
    ></app-navbar>

    <router-outlet></router-outlet>

    <div class="outer-container">
      <app-grid
        [images]="images"
        [isLoggedIn]="isLoggedIn"
        [currentUser]="currentUser"
        (usernameClick)="onUsernameClick($event)"
        (toggleFavoriteClick)="onToggleFavoriteClick($event)"
        (deleteImageClick)="onDeleteImageClick($event)"
      ></app-grid>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'Pinte Clone';
  selected: string = '';
  images: any[] = [];
  isLoggedIn: boolean = false;

  private authSub?: Subscription;
  currentUser: { id: number, username: string } | null = null;

  constructor(
    private imagesService: ImagesService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.hasToken();
  this.currentUser = this.decodeToken(this.auth.getToken());

    this.authSub = this.auth.isAuthenticated$.subscribe((isAuth) => {
      this.isLoggedIn = isAuth;
      // update currentUser whenever auth state changes
      this.currentUser = this.decodeToken(this.auth.getToken());
      if (isAuth) {
        this.imagesService.getImages().subscribe((data: any[]) => {
          this.images = data;
          this.selected = 'all';
        });
      }
    });

    this.imagesService.getImages().subscribe((data: any[]) => {
      this.images = data;
      this.selected = 'all';
    });
  }

  onSelectAllClick() {
    this.imagesService.getImages().subscribe((data) => {
      this.images = data;
      this.selected = 'all';
    });
  }

  onSelectFavoritesClick() {
    this.imagesService.getFavoriteImages().subscribe((data) => {
      this.images = data;
      this.selected = 'favorites';
    });
  }

  onSelectMyPicsClick() {
    if (this.currentUser == null) return;
    this.imagesService.getImagesByUser(this.currentUser?.id).subscribe((data) => {
      this.images = data;
      this.selected = 'myPics';
    });
  }

  onAddImageClick(url: string, title: string) {
    console.log('AppComponent.onAddImageClick called with:', { url, title });
    this.imagesService.addImage({ url, title }).subscribe((data) => {
      if (this.selected === 'myPics' || this.selected === 'all') {
        data.username = this.currentUser?.username || 'Unknown';
        this.images.unshift(data);
        this.selected = 'myPics';
      }
    });
  }

  onDeleteImageClick(image_id: number) {
    this.imagesService.deleteImage(image_id).subscribe(() => {
      this.images = this.images.filter((img) => img.id !== image_id);
    });
  }

  onUsernameClick(user_id: number) {
    this.imagesService.getImagesByUser(user_id).subscribe((data) => {
      this.images = data;
    });
  }

  onToggleFavoriteClick(image_id: number) {
    this.imagesService.toggleFavorite(image_id).subscribe({
      next: (res: any) => {
        const idx = this.images.findIndex((i) => i.id === image_id);
        if (idx !== -1) {
          const img = { ...this.images[idx] };
          if (typeof res.favorite_count !== 'undefined') {
            img.favorite_count = res.favorite_count;
          }
          if (typeof res.is_favorite !== 'undefined') {
            img.is_favorite = res.is_favorite;
          } else {
            img.is_favorite = res.is_favorite;
          }

          const newImages = [...this.images];
          newImages[idx] = img;
          this.images = newImages;
        }
      },
      error: (err) => {
        console.error('Failed to toggle favorite', err);
      },
    });
  }

  loginRedirect() {
    window.location.href = AUTH_URL;
  }

  private decodeToken(token: string | null | undefined): any | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      let id = typeof payload?.id === "number" ? payload.id : (Number(payload?.id) || null);
      let username = typeof payload?.username === "string" ? String(payload.username) : null;

      if (!id || !username) {
        return null;
      }

      return { id, username };
    } catch {
      return null;
    }
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  logout() {
    this.auth.logout();
    this.currentUser = null;
    window.location.reload();
  }
}