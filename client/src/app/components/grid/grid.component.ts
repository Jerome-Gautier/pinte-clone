import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImgModalComponent } from "./img-modal/img-modal.component";
import { ImgCardComponent } from "./img-card/img-card.component";
import { ImageModel } from '../../../lib/models';

@Component({
  selector: 'app-grid',
  imports: [NgIf, NgFor, ImgModalComponent, ImgCardComponent],
  template: `
    <div class="inner-container">
      <app-img-modal *ngIf="modalShown" [image]="modalContent" (close)="hideModal()"></app-img-modal>
      <div *ngIf="images" class="image-grid">
        <app-img-card
          *ngFor="let image of images"
          [image]="image"
          [isLoggedIn]="isLoggedIn"
          [currentUser]="currentUser"
          (usernameClick)="usernameClick.emit($event)"
          (toggleFavoriteClick)="toggleFavoriteClick.emit($event)"
          (deleteImageClick)="deleteImageClick.emit($event)"
          (showModal)="showModal($event)"
        ></app-img-card>
      </div>
    </div>
  `,
  styles: `
  .image-grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      max-width: 1200px;
      gap: 24px;
      padding: 24px 0;
      margin: auto;
    }
    
  `,
})
export class GridComponent {
  @Input() images: ImageModel[] = [];
  @Input() isLoggedIn: boolean = false;
  @Input() currentUser: { id: number, username: string } | null = null;

  @Output() usernameClick = new EventEmitter<number>();
  @Output() toggleFavoriteClick = new EventEmitter<any>();
  @Output() deleteImageClick = new EventEmitter<number>();

  modalShown: Boolean = false;
  modalContent: any = null;

  showModal(image: any) {
    this.modalContent = image;
    this.modalShown = true;
  }

  hideModal() {
    this.modalShown = false;
    this.modalContent = null;
  }
}