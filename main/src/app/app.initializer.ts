import { APP_INITIALIZER, Provider } from '@angular/core';
import { LanguageService } from '@paimon/app/services/language.service';

export const provideApplicationInitializer = (): Provider => {
  return [
    {
      provide: APP_INITIALIZER,
      useFactory: (languageService: LanguageService) => () => languageService.init(),
      deps: [LanguageService],
      multi: true
    }
  ];
};
