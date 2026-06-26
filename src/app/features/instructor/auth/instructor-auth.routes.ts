import { Routes } from '@angular/router';

export const instructorAuthRoutes: Routes = [
  {
    path: 'instructor/register',
    data: { showPublicShell: false },
    loadComponent: () =>
      import('./instructor-register/instructor-register.component').then(
        (m) => m.InstructorRegisterComponent
      )
  },
    {
    path: 'instructor/login',
    loadComponent: () =>
      import('./instructor-login/instructor-login.component').then(
        m => m.InstructorLoginComponent
      ),
    data: { showPublicShell: false }
  }
];

