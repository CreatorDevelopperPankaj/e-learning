import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './shared/layouts/public-layout/public-layout.component';
import { StudentLayoutComponent } from './shared/layouts/student-layout/student-layout.component';
import { InstructorLayoutComponent } from './shared/layouts/instructor-layout/instructor-layout.component';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { landingRoutes } from './features/landing/landing.routes';
import { authRoutes } from './features/auth/auth.routes';
import { studentRoutes } from './features/student/student.routes';
import { instructorRoutes } from './features/instructor/instructor.routes';
import { adminRoutes } from './features/admin/admin.routes';
import { instructorAuthRoutes } from './features/instructor/auth/instructor-auth.routes';
import { adminAuthRoutes } from './features/admin/auth/admin-auth.routes';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [...landingRoutes, ...authRoutes, ...instructorAuthRoutes, ...adminAuthRoutes]
  },


  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['student'] },
    children: studentRoutes
  },

  {
    path: 'instructor',
    component: InstructorLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['instructor'] },
    children: instructorRoutes
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    children: adminRoutes
  },

  { path: '**', redirectTo: '' }
];

