import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'zh' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private defaultLanguage = 'en';
  private _doc = inject(DOCUMENT);

  private get window(): Window | null {
    return this._doc.defaultView;
  }

  constructor(private translateService: TranslateService) {}

  init(): void {
    this.restoreLanguage();
  }

  restoreLanguage(): void {
    if (this.window) {
      const language = this.window.localStorage?.getItem('language') || this.defaultLanguage;
      if (language) {
        this.translateService.use(language);
      }
    }
  }

  get language(): Language {
    return this.translateService.currentLang as Language;
  }

  setLanguage(language: string): void {
    console.log(language, 'changed');
    if (this.window) {
      this.translateService.use(language);
      localStorage.setItem('language', language);
    }
  }
}
