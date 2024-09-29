/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { APP_INITIALIZER, LOCALE_ID, Provider } from '@angular/core';

import { Language, LanguageService } from '@paimon/app/services/language.service';
import { LocalStorageService } from '@paimon/app/services/local-storage.service';

import { provideTranslate } from './app.i18n';

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
