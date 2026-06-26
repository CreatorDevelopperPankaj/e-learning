import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.AdminDashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users.component').then((m) => m.AdminUsersComponent)
  },
  {
    path: 'instructors',
    loadComponent: () =>
      import('./instructors/instructors.component').then((m) => m.AdminInstructorsComponent)
  },
  {
    path: 'instructors/:id',
    loadComponent: () =>
      import('./instructors/instructor-details/instructor-details.component').then(
        (m) => m.InstructorDetailsComponent
      )
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./students/admin-students.component').then((m) => m.AdminStudentsComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.AdminProfileComponent)
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./courses/courses.component').then((m) => m.AdminCoursesComponent)
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./categories/categories.component').then((m) => m.AdminCategoriesComponent)
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./payments/payments.component').then((m) => m.AdminPaymentsComponent)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports/reports.component').then((m) => m.AdminReportsComponent)
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.AdminSettingsComponent)
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications/notifications.component').then(
        (m) => m.AdminNotificationsComponent
      )
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  }
];

