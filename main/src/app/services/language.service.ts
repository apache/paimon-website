import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@paimon/app/services/local-storage.service';

export type Language = 'zh' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService
  ) {}

  get language(): Language {
    return this.translateService.currentLang as Language;
  }

  setLanguage(language: Language): void {
    this.translateService.use(language);
    this.localStorageService.setLanguage(language);
  }
}
