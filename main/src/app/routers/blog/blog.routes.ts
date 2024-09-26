import { Routes } from '@angular/router';
import { BlogComponent } from '@paimon/app/routers/blog/blog.component';
import { BlogListComponent } from '@paimon/app/routers/blog/routers/blog-list/blog-list.component';
import { BlogDetailComponent } from '@paimon/app/routers/blog/routers/blog-detail/blog-detail.component';
import { PreloadGuard } from '@paimon/app/routers/blog/preload.guard';

export const blogRoutes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
      {
        path: '',
        component: BlogListComponent
      },
      {
        path: ':id',
        canActivate: [PreloadGuard],
        component: BlogDetailComponent
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: ''
      }
    ]
  }
];
