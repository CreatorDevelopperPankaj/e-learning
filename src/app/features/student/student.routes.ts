import { Routes } from '@angular/router';

export const studentRoutes: Routes = [
  {
    path: 'chat',
    loadChildren: () => import('./student-chat.routes').then((m) => m.studentChatRoutes)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.StudentDashboardComponent)
  },

  {
    path: 'my-courses',
    loadComponent: () =>
      import('./my-courses/my-courses.component').then((m) => m.StudentMyCoursesComponent)
  },
  {
    path: 'my-courses/lessons',
    loadComponent: () =>
      import('./all-lessons/all-lessons.component').then((m) => m.StudentAllLessonsComponent)
  },
  {
    path: 'my-courses/:courseId/learn',
    loadComponent: () =>
      import('./course-player/course-player.component').then((m) => m.StudentCoursePlayerComponent)
  },
  {
    path: 'my-courses/:courseId/details',
    loadComponent: () =>
      import('./course-details/course-details.component').then(
        (m) => m.StudentCourseDetailsComponent
      )
  },
  {
    path: 'learning',
    loadComponent: () =>
      import('./learning/learning.component').then((m) => m.StudentLearningComponent)
  },
  {
    path: 'certificates',
    loadComponent: () =>
      import('./certificates/certificates.component').then((m) => m.StudentCertificatesComponent)
  },
  {
    path: 'certificates/:certificateId',
    loadComponent: () =>
      import('./certificate-details/certificate-details.component').then(
        (m) => m.StudentCertificateDetailsComponent
      )
  },
  {
    path: 'assignments',
    loadComponent: () =>
      import('./assignments/assignments.component').then((m) => m.StudentAssignmentsComponent)
  },
  {
    path: 'messages',
    loadComponent: () =>
      import('./messages/messages.component').then((m) => m.StudentMessagesComponent)
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./wishlist/wishlist.component').then((m) => m.StudentWishlistComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.StudentProfileComponent)
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.StudentSettingsComponent)
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications/notifications.component').then(
        (m) => m.StudentNotificationsComponent
      )
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  }
];

