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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

import { BriefArticle, ResolvedArticle } from '@paimon-markdown-parser/article';

import { BaseUrlService } from '@paimon/app/services/base-url.service';
import { LanguageService } from '@paimon/app/services/language.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  briefArticles$: Observable<BriefArticle[]> | null = null;
  articles = new Map<string, ResolvedArticle>();

  get baseUrl(): string {
    return `${this.baseUrlService.getBaseUrl()}/metadata`;
  }

  constructor(
    private httpClient: HttpClient,
    private baseUrlService: BaseUrlService,
    private languageService: LanguageService
  ) {}

  getCategories(articles: BriefArticle[], maxCount = 0): string[] {
    const categoryMap = new Map<string, number>();
    articles.forEach(item => {
      item.categories.forEach(key => {
        const value = categoryMap.get(key);
        if (!value) {
          categoryMap.set(key, 1);
        } else {
          categoryMap.set(key, value + 1);
        }
      });
    });
    return Array.from(categoryMap)
      .sort(([, pc], [, nc]) => nc - pc)
      .filter(([, c]) => c > maxCount)
      .map(([v]) => v);
  }

  list(): Observable<BriefArticle[]> {
    if (this.briefArticles$) {
      return this.briefArticles$;
    } else {
      const query$ = this.httpClient.get<BriefArticle[]>(`${this.baseUrl}/articles/list.json`);
      this.briefArticles$ = combineLatest([query$, this.languageService.languageChanged()]).pipe(
        map(([data, language]) => data.filter(v => !v.languages || v.languages.includes(language))),
        shareReplay(1)
      );
      return this.briefArticles$;
    }
  }

  get(id: string): Observable<ResolvedArticle> {
    const cacheArticle = this.articles.get(id);
    if (cacheArticle) {
      return of(cacheArticle);
    } else {
      return this.httpClient.get<ResolvedArticle>(`${this.baseUrl}/articles/${id}.json`).pipe(
        tap(article => {
          this.articles.set(id, article);
        })
      );
    }
  }
}
