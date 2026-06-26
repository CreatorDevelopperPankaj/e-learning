import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const roleLoginMap: Record<string, string> = {
  admin:      '/admin/login',
  instructor: '/instructor/login',
  student:    '/login'
};

const roleHomeMap: Record<string, string> = {
  admin:      '/admin/dashboard',
  instructor: '/instructor/dashboard',
  student:    '/student/dashboard'
};

const getUserRole = (authService: AuthService): string => {
  const user = authService.currentUser;
  if (user?.role) return user.role.toLowerCase();
  if (user?.roleId === 3) return 'admin';
  if (user?.roleId === 2) return 'instructor';
  return 'student';
};

export const roleGuard: CanActivateFn = (route) => {
  const authService  = inject(AuthService);
  const router       = inject(Router);
  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  // Not authenticated — role ke basis pe login page pe bhejo
  if (!authService.isAuthenticated) {
    const role      = getUserRole(authService);
    const loginPage = roleLoginMap[role] ?? '/login';

    console.log(`🔒 Not authenticated — redirecting to ${loginPage}`);
    return router.createUrlTree([loginPage]);
  }

  const role = getUserRole(authService);

  // Allowed roles check — agar route pe role allowed hai toh jaane do
  if (!allowedRoles?.length || allowedRoles.includes(role)) {
    return true;
  }

  // Wrong role — apne dashboard pe bhejo
  const homePage = roleHomeMap[role] ?? '/login';
  console.log(`Role '${role}' not allowed — redirecting to ${homePage}`);
  return router.createUrlTree([homePage]);
};