import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Each role has its own login page
const roleLoginMap: Record<string, string> = {
  admin:      '/admin/login',
  instructor: '/instructor/login',
  student:    '/login'  // default student login
};

// Each role has its own home/dashboard
const roleHomeMap: Record<string, string> = {
  admin:      '/admin/dashboard',
  instructor: '/instructor/dashboard',
  student:    '/student/dashboard'
};

// Helper — user ka role string return karta hai
const getUserRole = (authService: AuthService): string => {
  const user = authService.currentUser;

  // role string se check karo
  if (user?.role) return user.role.toLowerCase();

  // fallback — roleId se check karo
  if (user?.roleId === 3) return 'admin';
  if (user?.roleId === 2) return 'instructor';
  return 'student';
};

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (authService.isAuthenticated) return true;

  // Token expired ya missing — role ke basis pe same login page pe bhejo
  const role      = getUserRole(authService);
  const loginPage = roleLoginMap[role] ?? '/login';

  console.log(`Session expired — redirecting ${role} to ${loginPage}`);

  // Storage clear karo
  authService.logout();

  return router.createUrlTree([loginPage]);
};