import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [NgIf],
  template: `
    <nav class="navbar">
      <div class="outer-container">
        <div class="inner-container">
          <button>
            <p>Logo</p>
          </button>
          <ul class="nav-links">
            <li>
              <button
                [class.active]="selected === 'all'"
                (click)="selectAllClick.emit()"
              >
                All
              </button>
            </li>
            <ng-container *ngIf="isLoggedIn">
              <li>
                <button
                  [class.active]="selected === 'favorites'"
                  (click)="selectFavoritesClick.emit()"
                >
                  Favorites
                </button>
              </li>
              <li>
                <button
                  [class.active]="selected === 'myPics'"
                  (click)="selectMyPicsClick.emit()"
                >
                  My Pics
                </button>
              </li>
              <li class="addpic-container">
                <button (click)="showDropdown = !showDropdown">Add a Pic</button>
                <div class="addpic-dropdown" *ngIf="showDropdown">
                  <input #imgUrl type="text" id="image-url" placeholder="Image URL" />
                  <input #imgTitle type="text" id="image-title" placeholder="Image Title" />
                  <button (click)="submitImage(imgUrl.value, imgTitle.value)">Submit</button>
                </div>
              </li>
            </ng-container>
          </ul>
          <div class="user-container">
          <button *ngIf="isLoggedIn; else showLogin" (click)="logout.emit()">
            <img
              src="/images/github-logo.svg"
              alt="GitHub Logo"
              width="20"
              height="20"
            />
            <p>Logout</p>
          </button>
          <ng-template #showLogin>
            <button (click)="loginRedirect.emit()">
              <img
                src="/images/github-logo.svg"
                alt="GitHub Logo"
                width="20"
                height="20"
              />
              <p>Login</p>
            </button>
          </ng-template>
        </div>
        </div>
      </div>
    </nav>
  `,
  styles: `
    .navbar {
      width: 100%;
      height: 64px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      border-radius: 0 0 12px 12px;
      padding: 0 32px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar .outer-container {
      height: 100%;
      width: 100%;
      max-width: 1200px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin: 0 auto;
    }

    .navbar .inner-container {
      display: flex;
      width: 100%;
      gap: 40px;
      align-items: center;
    }

    .navbar .inner-container button {
      background: none;
      border: none;
      font-size: 1.3rem;
      font-weight: 700;
      color: #e60023;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .navbar .inner-container button:hover {
      background: #fbe9ec;
    }

    .navbar .inner-container .nav-links {
      display: inline-flex;
      gap: 16px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .navbar .inner-container .nav-links button {
      background: none;
      border: none;
      font-size: 1rem;
      color: #333;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background 0.2s, color 0.2s;
      cursor: pointer;
    }

    .navbar .inner-container .nav-links button:hover {
      background: #e600237c;
      color: #fff;
    }

    .navbar .inner-container .nav-links button.active {
      background: #e60023;
      color: #fff;
    }

    .navbar .inner-container .addpic-container {
      position: relative;
    }

    .navbar .inner-container .addpic-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
    }

    .navbar .inner-container .addpic-dropdown input {
      margin-bottom: 8px;
      padding: 8px;
    }

    .navbar .inner-container .addpic-dropdown button {
      background: #e60023;
      color: #fff;
      border: none;
    }

    .navbar .inner-container .addpic-dropdown button:hover {
      background: #ad001b;
    }

    .navbar .user-container {
      margin-left: auto;
    }

    .navbar .user-container button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #e60023;
      color: #fff;
      border: none;
      font-size: 1rem;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
      box-shadow: 0 1px 4px rgba(230,0,35,0.08);
    }

    .navbar .user-container button img {
      filter: invert(1);
    }

    .navbar .user-container button:hover {
      background: #ad001b;
    }

    @media (max-width: 820px) {
      .navbar {
        height: auto;
        padding: 8px;
      }
      .navbar .inner-container {
        gap: 0;
        flex-flow: row wrap;
      }
      .navbar .inner-container .nav-links {
        justify-content: center;
        width: 100%;
        margin-top: 8px;
        order: 3;
      }
      .navbar .inner-container .nav-links button {
        font-size: 0.9rem;
        padding: 8px;
      }
      .navbar .inner-container .addpic-dropdown {
        left: -150%;
      }
    }
  `,
})
export class NavbarComponent {
  @Input() selected: string = '';
  @Input() isLoggedIn: boolean = false;

  @Output() selectAllClick = new EventEmitter<void>();
  @Output() selectFavoritesClick = new EventEmitter<void>();
  @Output() selectMyPicsClick = new EventEmitter<void>();
  @Output() onAddImageClick = new EventEmitter<{ url: string; title: string }>();
  @Output() loginRedirect = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  showDropdown: boolean = false;

  submitImage(url: string, title: string) {
    if (url && title) {
      this.onAddImageClick.emit({ url: url.trim() ?? '', title: title.trim() });
      this.showDropdown = false;
    }
  }
}