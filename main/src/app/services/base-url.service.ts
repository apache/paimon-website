import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BaseUrlService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
  getBaseUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      return './assets/metadata';
    } else {
      return 'http://localhost:8801/assets/metadata';
    }
  }
}
