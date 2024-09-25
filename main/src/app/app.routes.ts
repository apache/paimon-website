import { Routes } from '@angular/router';
import { HomeComponent } from './routers/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'blog',
    loadChildren: () => import('@paimon/app/routers/blog/blog.routes').then(m => m.blogRoutes)
  }
];
