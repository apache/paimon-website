import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
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

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.preload(route.params?.id);
  }
}
