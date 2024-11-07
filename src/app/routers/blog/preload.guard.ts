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
