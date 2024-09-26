import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly currentLangKey = 'paimon-website-language';
  private readonly platformId = inject(PLATFORM_ID);

  setLanguage(lang: string): void {
    if (isPlatformBrowser(this.platformId) && window?.localStorage) {
      localStorage.setItem(this.currentLangKey, lang);
    }
  }

  getLanguage(fallback: string): string {
    if (isPlatformBrowser(this.platformId) && window?.localStorage) {
      return localStorage.getItem(this.currentLangKey) || fallback;
    }
    return fallback;
  }
}
