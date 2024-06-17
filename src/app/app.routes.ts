import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./core/auth/auth.routes').then(m => m.authRoutes)
        
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./core/main/main.routes').then(m => m.mainRoutes)
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },


];
