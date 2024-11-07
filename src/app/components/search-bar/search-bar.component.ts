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
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';
import { BriefArticle } from '@paimon-markdown-parser/article';

import { ClickOutsideDirective } from '@paimon/app/components/click-outside/click-outside.directive';
import { DividerComponent } from '@paimon/app/components/ui-components';
import { ArticleService } from '@paimon/app/services/article.service';

@Component({
  selector: 'paimon-search-bar',
  standalone: true,
  imports: [ClickOutsideDirective, DividerComponent, FormsModule, NgIf, RouterLink, TranslateModule],
  templateUrl: './search-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent {
  searchValue = '';
  showSearchInput = false;
  listOfResult: BriefArticle[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private articleService: ArticleService
  ) {}

  toggleSearchInput(visible: boolean): void {
    this.showSearchInput = visible;
    this.cdr.markForCheck();
  }

  search(): void {
    this.articleService
      .list()
      .pipe(
        map(data => {
          return data.filter(
            item =>
              item.name.toLowerCase().includes((this.searchValue || '').toLowerCase()) ||
              item.authors.find(author => author.name?.toLowerCase()?.includes((this.searchValue || '').toLowerCase()))
          );
        })
      )
      .subscribe(result => {
        this.listOfResult = result || [];
        this.cdr.markForCheck();
      });
  }
}
