import { Routes } from '@angular/router';
import { BlogComponent } from '@paimon/app/routers/blog/blog.component';
import { BlogListComponent } from '@paimon/app/routers/blog/routers/blog-list/blog-list.component';

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
        path: '**',
        pathMatch: 'full',
        redirectTo: ''
      }
    ]
  }
];
