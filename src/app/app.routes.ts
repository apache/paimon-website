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
import { Routes } from '@angular/router';

import { DownloadsComponent, downloadsResolver } from '@paimon/app/routers/downloads/downloads.component';
import { HomeComponent } from '@paimon/app/routers/home/home.component';
import { SecurityComponent } from '@paimon/app/routers/security/security.component';
import { TeamComponent } from '@paimon/app/routers/team/team.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'blog',
    loadChildren: () => import('@paimon/app/routers/blog/blog.routes').then(m => m.blogRoutes)
  },
  {
    path: 'team',
    component: TeamComponent
  },
  {
    path: 'security',
    component: SecurityComponent
  },
  {
    path: 'downloads',
    component: DownloadsComponent,
    resolve: {
      downloads: downloadsResolver
    }
  },
  {
    path: 'releases',
    loadChildren: () => import('@paimon/app/routers/releases/releases.routes').then(m => m.releasesRoutes)
  }
];
