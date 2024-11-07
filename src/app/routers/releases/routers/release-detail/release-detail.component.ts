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
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ResolvedDocument } from '@paimon-markdown-parser/document';

import { MarkdownRenderComponent } from '@paimon/app/components/markdown-render/markdown-render.component';
import { GithubUrlPipe } from '@paimon/app/components/pipes/github-url.pipe';
import { DropdownLinksComponent, DropdownOption } from '@paimon/app/components/ui-components';
import { DocumentService } from '@paimon/app/services/document.service';

@Component({
  selector: 'paimon-release-detail',
  standalone: true,
  imports: [RouterLink, DropdownLinksComponent, MarkdownRenderComponent, GithubUrlPipe],
  templateUrl: './release-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseDetailComponent implements OnInit {
  release: ResolvedDocument | null;
  links: DropdownOption[] = [];

  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  get latestVersion(): string {
    return this.documentService.latestVersion;
  }

  constructor(
    private documentService: DocumentService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.documentService.listRelease().subscribe(releases => {
      this.links = releases.map(release => ({
        label: release.version,
        value: ['/', 'releases', release.version]
      }));
      this.cdr.markForCheck();
    });

    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ version }) => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto'
        });
      }
      this.documentService.getRelease(version).subscribe(release => {
        this.release = release;
        this.cdr.markForCheck();
      });
      this.documentService.activeVersion$.next(version);
    });
  }
}
