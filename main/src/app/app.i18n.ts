import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const provideTranslate = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
          deps: [HttpClient]
        }
      })
    )
  ]);
