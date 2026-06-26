import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

// Minimal guard: ensures user is authenticated.
// A full implementation should also validate enrollment via a backend endpoint.
export const AuthChatGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) return true;

  // Fallback to the existing login entry route for the current role.
  // Role login mapping is implemented in core/auth guard; keep it simple here.
  return router.createUrlTree(['/login']);
};

