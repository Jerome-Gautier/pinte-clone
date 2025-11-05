import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageModel } from '../../../../lib/models';

@Component({
  selector: 'app-img-card',
  imports: [NgIf],
  template: `
    <div *ngIf="image" class="image-card">
          <button 
          *ngIf="image.user_id === currentUser?.id"
            class="delete-btn" 
            (click)="deleteImageClick.emit(image.id)"
          >
            🗑️
          </button>
          <img (click)="clickShowModal(image)" [src]="image.url" [alt]="image.title" />
          <div class="image-title">{{ image.title }}</div>
          <div class="user-control">
            <div
              class="image-owner"
              (click)="usernameClick.emit(image.user_id)"
            >
              By: {{ image.username }}
            </div>
            <button
              class="image-favorite"
              [class.favorited]="image.is_favorite"
              (click)="toggleFavoriteClick.emit(image.id)"
              [disabled]="!isLoggedIn"
            >
              ★ {{ image.favorite_count }}
            </button>
          </div>
        </div>
  `,
  styles: `
  .image-card {
      position: relative;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: box-shadow 0.2s;
      cursor: pointer;
    }
    .image-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
    .image-card .delete-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      cursor: pointer;
      font-size: 0.8em;
      background: transparent;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 4px 4px;
      transition: background 0.3s, border-color 0.3s, color 0.3s;
    }
    .image-card .delete-btn:hover {
      background: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }
    .image-card img {
      width: 180px;
      height: 180px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 12px;
      background: #f0f0f0;
    }
    .image-title {
      font-weight: 600;
      margin-bottom: 6px;
      text-align: center;
    }
    .user-control {
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
    }
    .image-owner {
      font-size: 1em;
      color: #555;
      margin-bottom: 4px;
    }
    .image-owner:hover {
      text-decoration: underline;
      cursor: pointer;
    }
    .image-favorite {
      cursor: pointer;
      font-size: 0.95em;
      color: black;
      border: 1px solid #ccc;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .image-favorite.favorited {
      color: #2196f3;
      text-shadow: 0 0 8px #2196f366;
    }
    .image-favorite:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    .no-images {
      text-align: center;
      color: #aaa;
      padding: 40px 0;
    }`
})
export class ImgCardComponent {
  @Input() image: ImageModel | null = null;
  @Input() isLoggedIn: boolean = false;
  @Input() currentUser: { id: number, username: string } | null = null;

  @Output() usernameClick = new EventEmitter<number>();
  @Output() toggleFavoriteClick = new EventEmitter<any>();
  @Output() deleteImageClick = new EventEmitter<number>();
  @Output() showModal = new EventEmitter<any>();

  clickShowModal(image: any) {
    this.showModal.emit(image);
  }
}
