import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicShellService {
  private readonly authPaths = new Set([
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
    '/profile-setup'
  ]);

  /**
   * Returns true if the public shell (header/sidebar) should be visible
   * for the given URL/path.
   */
  shouldShowShell(url: string | null | undefined): boolean {
    const currentPath = (url || '').split('?')[0].split('#')[0];
    return !this.authPaths.has(currentPath);
  }
}

