import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    data: { showPublicShell: false },
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    data: { showPublicShell: false },
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'verify-email',
    data: { showPublicShell: false },
    loadComponent: () =>
      import('./verify-email/verify-email.component').then((m) => m.VerifyEmailComponent)
  },
  {
    path: 'forgot-password',
    data: { showPublicShell: false },
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      )
  },
  {
    path: 'reset-password',
    data: { showPublicShell: false },
    loadComponent: () =>
      import('./reset-password/reset-password.component').then((m) => m.ResetPasswordComponent)
  },
  {
    path: 'profile-setup',
    data: { showPublicShell: false },
    loadComponent: () =>
      import('./profile-setup/profile-setup.component').then((m) => m.ProfileSetupComponent)
  }
];

