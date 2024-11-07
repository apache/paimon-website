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
  Input,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { fromEvent, startWith } from 'rxjs';

import { TOC } from '@paimon-markdown-parser/article';

import { AnchorComponent } from '@paimon/app/routers/blog/components/anchor/anchor.component';

@Component({
  selector: 'paimon-markdown-render',
  standalone: true,
  imports: [AnchorComponent],
  templateUrl: './markdown-render.component.html',
  styleUrl: './markdown-render.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownRenderComponent implements OnInit {
  @Input() set html(content: string) {
    this.safeContent = this.sanitized.bypassSecurityTrustHtml(content);
    this.cdr.markForCheck();
  }
  @Input() set toc(anchors: TOC[]) {
    this.anchors = this.getFlattenTreeFromTOC(anchors);
    this.cdr.markForCheck();
  }
  safeContent: SafeHtml | null = null;
  anchors: TOC[] = [];
  showAnchor = false;

  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private sanitized: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

  private getFlattenTreeFromTOC = (toc: TOC[]): TOC[] => {
    if (!toc.length) {
      return [];
    } else {
      const firstDepth = toc[0].depth;
      return toc.map(e => ({
        ...e,
        depth: e.depth - firstDepth
      }));
    }
  };
}
