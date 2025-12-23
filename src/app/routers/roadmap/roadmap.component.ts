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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveFn } from '@angular/router';

import { ResolvedDocument } from '@paimon-markdown-parser/document';

import { MarkdownRenderComponent } from '@paimon/app/components/markdown-render/markdown-render.component';
import { PageContainerComponent } from '@paimon/app/components/page-container/page-container.component';
import { GithubUrlPipe } from '@paimon/app/components/pipes/github-url.pipe';
import { DocumentService } from '@paimon/app/services/document.service';

export const roadmapResolver: ResolveFn<unknown> = () => {
  const documentService = inject(DocumentService);
  return documentService.getRoadmap();
};

@Component({
  selector: 'paimon-roadmap',
  standalone: true,
  imports: [PageContainerComponent, MarkdownRenderComponent, GithubUrlPipe],
  templateUrl: './roadmap.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoadmapComponent implements OnInit {
  roadmap: ResolvedDocument | null = null;
  constructor(
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roadmap }) => {
      this.roadmap = roadmap;
      this.cdr.markForCheck();
    });
  }
}
