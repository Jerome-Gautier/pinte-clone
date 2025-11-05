import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-img-modal',
  imports: [],
  template: `
  <div class="modal-backdrop" (click)="close.emit()">
    <div class="modal-container" (click)="$event.stopPropagation()">
      <button class="close-btn" (click)="close.emit()">Close</button>
      <img [src]="image.url" [alt]="image.title" />
      <div class="image-title">{{ image.title }}</div>
      <a href="{{ image.url }}" target="_blank" rel="noopener noreferrer">Go to Source</a>
    </div>
  </div>
  `,
  styles: `
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-container {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 100vw;
      max-height: 100vh;
      overflow: auto;
      position: relative;
    }

    .modal-container .close-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      color: #333;
      transition: color 0.2s;
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .modal-container .close-btn:hover {
      color: #e60023;
    }

    .modal-container img {
      max-width: 85vw;
      max-height: 85vh;
      border-radius: 8px;
      margin-bottom: 16px;
    }
  `
})
export class ImgModalComponent {
  @Output() close = new EventEmitter<void>();
  @Input() image: any;
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.close.emit();
    }
  }

}
