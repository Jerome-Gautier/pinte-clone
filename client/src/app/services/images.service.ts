import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private apiUrl = '/api';

  constructor(private http:HttpClient) {}

  getImages() {
    return this.http.get<any[]>(`${this.apiUrl}/images`);
  }

  getImagesByUser(user_id: number) {
    return this.http.get<any[]>(`${this.apiUrl}/images/${user_id}`);
  }

  getFavoriteImages() {
    return this.http.get<any[]>(`${this.apiUrl}/images/favorites`);
  }
  
  addImage(imageData: any) {
    return from(this.canDisplayImage(imageData.url)).pipe(
      switchMap((ok) => {
  const payload = { ...imageData, url: ok ? imageData.url : '/images/placeholder.png' };
        return this.http.post<any>(`${this.apiUrl}/images`, payload);
      })
    );
  }

  private canDisplayImage(url: string | undefined, timeout = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      if (!url) return resolve(false);
      const img = new Image();
      let timer = window.setTimeout(() => {
        cleanup();
        resolve(false);
      }, timeout);

      function cleanup() {
        clearTimeout(timer);
        img.onload = null;
        img.onerror = null;
      }

      img.onload = () => {
        cleanup();
        // Ensure the image actually has dimensions
        resolve(!(img.naturalWidth === 0 && img.naturalHeight === 0));
      };
      img.onerror = () => {
        cleanup();
        resolve(false);
      };
      img.src = url;
      if (img.complete) {
        // allow browser to populate dimensions
        setTimeout(() => {
          cleanup();
          resolve(!(img.naturalWidth === 0 && img.naturalHeight === 0));
        }, 0);
      }
    });
  }

  deleteImage(image_id: number) {
    return this.http.delete<any>(`${this.apiUrl}/images/${image_id}`);
  }

  toggleFavorite(image_id: number) {
    return this.http.post<any>(`${this.apiUrl}/images/${image_id}/favorite`, {});
  }
}