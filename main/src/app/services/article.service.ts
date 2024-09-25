import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BriefArticle, ResolvedArticle } from '@paimon-markdown-parser/article';
import { Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { BaseUrlService } from '@paimon/app/services/base-url.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  briefArticles$: Observable<BriefArticle[]> | null = null;
  articles = new Map<string, ResolvedArticle>();
  constructor(
    private httpClient: HttpClient,
    private baseUrlService: BaseUrlService
  ) {}

  getCategories(articles: BriefArticle[], type: number, maxCount = 0): string[] {
    const categoryMap = new Map<string, number>();
    articles.forEach(item => {
      (type ? item.categories : item.categoriesCN).forEach(key => {
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
      this.briefArticles$ = this.httpClient
        .get<BriefArticle[]>(`${this.baseUrlService.getBaseUrl()}/articles/list.json`)
        .pipe(shareReplay(1));
      return this.briefArticles$;
    }
  }

  get(id: string): Observable<ResolvedArticle> {
    const cacheArticle = this.articles.get(id);
    if (cacheArticle) {
      return of(cacheArticle);
    } else {
      return this.httpClient.get<ResolvedArticle>(`${this.baseUrlService.getBaseUrl()}/articles/${id}.json`).pipe(
        tap(article => {
          this.articles.set(id, article);
        })
      );
    }
  }
}
