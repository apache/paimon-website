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
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { DocumentService } from '@paimon/app/services/document.service';

export const canActivateReleases: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const documentService = inject(DocumentService);
  const urlTree = router.parseUrl(state.url);

  return documentService.listRelease().pipe(
    map(() => {
      const segments = urlTree.root.children['primary'].segments;
      if (segments.length === 2 && documentService.releases.has(segments[1].path)) {
        return true;
      }

      // if the version is not found, redirect to the latest version
      return router.createUrlTree(['/releases', documentService.latestVersion]);
    })
  );
};
