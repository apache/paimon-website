import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ArticleService } from '@paimon/app/services/article.service';

@Injectable({
  providedIn: 'root'
})
export class PreloadGuard implements CanActivate {
  constructor(private articleService: ArticleService) {}

  preload(id: string): Observable<boolean> {
    return this.articleService.get(id).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  canActivate(route: ActivatedRouteSnapshot): MaybeAsync<GuardResult> {
    return this.preload(route.params?.['id']);
  }
}
