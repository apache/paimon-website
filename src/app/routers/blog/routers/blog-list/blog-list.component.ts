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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { BriefArticle } from '@paimon-markdown-parser/article';

import { PageContainerComponent } from '@paimon/app/components/page-container/page-container.component';
import { PaginationComponent } from '@paimon/app/components/ui-components';
import { BlogCardComponent } from '@paimon/app/routers/blog/components/blog-card/blog-card.component';
import { ArticleService } from '@paimon/app/services/article.service';

@Component({
  selector: 'paimon-blog-list',
  standalone: true,
  imports: [PageContainerComponent, PaginationComponent, BlogCardComponent, RouterLink, TranslateModule],
  templateUrl: './blog-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent implements OnInit {
  total = 0;
  pageIndex = 1;
  pageSize = 5;
  latestPostsPageSize = 10;
  selectedCategory = '';

  listOfArticles: BriefArticle[] = [];
  listOfShownArticles: BriefArticle[] = [];
  listOfLatestArticles: BriefArticle[] = [];
  listOfCategories: string[] = [];

  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.articleService.list().subscribe(data => {
      this.total = data.length;
      this.listOfLatestArticles = data.slice(0, this.latestPostsPageSize);
      this.listOfShownArticles = data.slice(0, this.pageSize);
      this.listOfArticles = data;
      this.listOfCategories = this.articleService.getCategories(data);
      this.cdr.markForCheck();
    });
  }

  updateShown(): void {
    const filteredArticles = this.listOfArticles.filter(
      a => !this.selectedCategory || a.categories.includes(this.selectedCategory)
    );
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    this.listOfLatestArticles = filteredArticles.slice(0, this.latestPostsPageSize);
    this.listOfShownArticles = filteredArticles.slice(startIndex, startIndex + this.pageSize);
    this.total = filteredArticles.length;
  }

  categoryChange(value: string): void {
    this.pageIndex = 1;
    this.selectedCategory = value;
    this.updateShown();
  }
}
