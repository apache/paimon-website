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
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { fromEvent, startWith } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';
import { ResolvedArticle, TOC } from '@paimon-markdown-parser/article';

import { AnchorComponent } from '@paimon/app/routers/blog/components/anchor/anchor.component';
import { BlogDetailFooterComponent } from '@paimon/app/routers/blog/components/blog-detail-footer/blog-detail-footer.component';
import { ArticleService } from '@paimon/app/services/article.service';

@Component({
  selector: 'paimon-blog-detail',
  standalone: true,
  imports: [RouterLink, AnchorComponent, BlogDetailFooterComponent, TranslateModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailComponent implements OnInit {
  article: ResolvedArticle | null = null;
  tocs: TOC[] = [];
  safeContent: SafeHtml | null = null;
  name: string | null = null;

  showAnchor = false;
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute,
    private sanitized: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ id }) => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto'
        });
      }
      this.articleService.get(id).subscribe(article => {
        this.article = article;
        this.tocs = this.getFlattenTreeFromArticle(article);
        this.safeContent = this.sanitized.bypassSecurityTrustHtml(article.content);
        this.cdr.markForCheck();
      });
    });

    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'scroll')
        .pipe(startWith(true), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const offsetY = window.scrollY || document.documentElement.scrollTop;
          this.showAnchor = offsetY > 280;
          this.cdr.markForCheck();
        });
    }
  }

  private getFlattenTreeFromArticle = (article: ResolvedArticle): ResolvedArticle['toc'] => {
    if (!article.toc.length) {
      return [];
    } else {
      const firstDepth = article.toc[0].depth;
      return article.toc.map(e => ({
        ...e,
        depth: e.depth - firstDepth
      }));
    }
  };
}
