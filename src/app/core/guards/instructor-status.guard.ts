import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const instructorStatusGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const status = (authService.currentUser as any)?.instructorStatus;


  // If user isn't authenticated, let authGuard handle it.
  if (!authService.isAuthenticated) {
    return router.createUrlTree(['/login']);
  }

  // Default unknown -> deny
  if (status !== 'Approved') {
    // Instructor auth pages are public under /login (see instructor-auth.routes.ts)
    return router.createUrlTree(['/login']);
  }

  return true;
};

