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
import { isPlatformBrowser, NgClass, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  PLATFORM_ID
} from '@angular/core';

import { TOC } from '@paimon-markdown-parser/article';
import GithubSlugger from 'github-slugger';

const githubSlugger = new GithubSlugger();

type DomObj = Record<string, number>;

@Component({
  selector: 'paimon-anchor',
  standalone: true,
  imports: [NgClass],
  templateUrl: './anchor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnchorComponent implements OnChanges {
  @Input() links: TOC[] = [];
  @Input() classNames = 'top-6';

  highLightId?: string | null;
  intersectionObserver?: IntersectionObserver;
  domShow: DomObj = {};

  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private viewportScroller: ViewportScroller,
    private cdr: ChangeDetectorRef
  ) {}

  scrollTo(id: string | null, title: string): void {
    const convertId = id || githubSlugger.slug(title);
    this.viewportScroller.setOffset([0, 84]);
    this.viewportScroller.scrollToAnchor(convertId);
  }

  observe(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.intersectionObserver?.disconnect();
      this.intersectionObserver = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            this.domShow[entry.target.id] = entry.intersectionRatio;
          }
          const highlightItem = this.links.find(item => item.id && this.domShow[item.id] > 0);
          if (highlightItem) {
            this.highLightId = highlightItem.id;
          }
          this.cdr.markForCheck();
        },
        {
          threshold: [0, 0.5, 1],
          rootMargin: '-60px 0px'
        }
      );
      this.links.forEach(item => {
        if (isPlatformBrowser(this.platformId) && window?.document) {
          const element = document.getElementById(item.id!);
          if (element) {
            this.intersectionObserver?.observe(element);
          }
        }
      });
    }
  }

  ngOnChanges(): void {
    this.observe();
  }
}
