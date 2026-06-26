import { Routes } from '@angular/router';
import { instructorStatusGuard } from '../../core/guards/instructor-status.guard';

export const instructorRoutes: Routes = [
  {
    path: 'chat',
    loadChildren: () => import('./instructor-chat.routes').then((m) => m.instructorChatRoutes)
  },
  {
    path: 'dashboard',
    canActivate: [instructorStatusGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.InstructorDashboardComponent
      )
  },

  {
    path: 'course-builder',
    loadComponent: () =>
      import('./course-builder/course-builder.component').then(
        (m) => m.InstructorCourseBuilderComponent
      )
  },
  {
    path: 'my-courses',
    loadComponent: () =>
      import('./my-courses/my-courses.component').then((m) => m.InstructorMyCoursesComponent)
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./students/students.component').then((m) => m.InstructorStudentsComponent)
  },
  {
    path: 'earnings',
    loadComponent: () =>
      import('./earnings/earnings.component').then((m) => m.InstructorEarningsComponent)
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/analytics.component').then((m) => m.InstructorAnalyticsComponent)
  },
  {
    path: 'messages',
    loadComponent: () =>
      import('./messages/messages.component').then((m) => m.InstructorMessagesComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.InstructorProfileComponent)
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.InstructorSettingsComponent)
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications/notifications.component').then(
        (m) => m.InstructorNotificationsComponent
      )
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  }
];

