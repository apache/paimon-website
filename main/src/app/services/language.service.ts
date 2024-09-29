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
import { Injectable } from '@angular/core';

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
