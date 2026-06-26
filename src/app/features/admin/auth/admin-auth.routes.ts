import { Routes } from '@angular/router';

export const adminAuthRoutes: Routes = [
  {
    path: 'admin/login',
    data: { showPublicShell: false },
    loadComponent: () =>
      import('./admin-login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      )
  }
];

