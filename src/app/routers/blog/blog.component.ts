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
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';
import { ResolvedArticle } from '@paimon-markdown-parser/article';

import { PageContainerComponent } from '@paimon/app/components/page-container/page-container.component';
import { ArticleService } from '@paimon/app/services/article.service';

@Component({
  selector: 'paimon-blog',
  standalone: true,
  imports: [PageContainerComponent, RouterOutlet, TranslateModule],
  templateUrl: './blog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent implements OnInit {
  article: ResolvedArticle | null = null;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(item => item instanceof NavigationEnd),
        startWith(true),
        map(() => true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const id = this.activatedRoute?.snapshot?.firstChild?.params?.['id'];
        if (id) {
          this.loadArticle(id);
        } else {
          this.article = null;
        }
      });
  }

  private loadArticle(id: string): void {
    this.articleService.get(id).subscribe(article => {
      this.article = article;
    });
  }
}
