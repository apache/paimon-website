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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

import { BriefRelease, ResolvedDocument } from '@paimon-markdown-parser/document';

import { BaseUrlService } from '@paimon/app/services/base-url.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  briefReleases$: Observable<BriefRelease[]> | null = null;
  releases = new Map<string, ResolvedDocument>();
  latestVersion: string;
  activeVersion$ = new Subject<string>();

  get baseUrl(): string {
    return `${this.baseUrlService.getBaseUrl()}/docs`;
  }

  constructor(
    private httpClient: HttpClient,
    private baseUrlService: BaseUrlService
  ) {}

  getDownloads(): Observable<ResolvedDocument> {
    return this.httpClient.get<ResolvedDocument>(`${this.baseUrl}/downloads.json`);
  }

  listRelease(): Observable<BriefRelease[]> {
    if (this.briefReleases$) {
      return this.briefReleases$;
    } else {
      const query$ = this.httpClient.get<BriefRelease[]>(`${this.baseUrl}/releases.json`).pipe(
        tap(releases => {
          this.latestVersion = releases[0]?.version;
        })
      );
      this.briefReleases$ = query$.pipe(shareReplay(1));
      return this.briefReleases$;
    }
  }

  getRelease(version: string): Observable<ResolvedDocument> {
    const cacheRelease = this.releases.get(version);
    if (cacheRelease) {
      return of(cacheRelease);
    } else {
      return this.httpClient.get<ResolvedDocument>(`${this.baseUrl}/${version}.json`).pipe(
        tap(release => {
          this.releases.set(version, release);
        })
      );
    }
  }
}
