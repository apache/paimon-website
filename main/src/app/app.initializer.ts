import { APP_INITIALIZER, LOCALE_ID, Provider } from '@angular/core';
import { Language, LanguageService } from '@paimon/app/services/language.service';
import { LocalStorageService } from '@paimon/app/services/local-storage.service';
import { provideTranslate } from '@paimon/app/app.i18n';

export const provideApplicationInitializer = (options: { defaultLanguage: Language }): Provider => {
  return [
    provideTranslate(options.defaultLanguage),
    {
      provide: LOCALE_ID,
      useFactory: (localStorageService: LocalStorageService) => {
        return localStorageService.getLanguage(options.defaultLanguage);
      },
      deps: [LocalStorageService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (languageService: LanguageService, language: Language) => () => {
        languageService.setLanguage(language);
      },
      deps: [LanguageService, LOCALE_ID],
      multi: true
    }
  ];
};
