import { Injectable } from '@angular/core';
import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.handleHttpError(error, req);
        } else {
          this.notificationService.error('Something went wrong. Please try again.');
        }

        return throwError(() => error);
      })
    );
  }

  private handleHttpError(error: HttpErrorResponse, req: HttpRequest<any>): void {
    if (req.context.get(SKIP_ERROR_TOAST)) {
      return;
    }

    const message = this.resolveMessage(error);
    const summary = this.resolveSummary(error.status);

    if (error.status === 401 && !this.isAuthEndpoint(req.url)) {
      // Avoid interrupting login flows for admin/instructor.
      // Also avoid redirect loops when the user is on /admin or /instructor.
      const isOnAdminRoute = this.router.url.startsWith('/admin');
      const isOnInstructorRoute = this.router.url.startsWith('/instructor');

      if (!isOnAdminRoute && !isOnInstructorRoute) {
        this.authService.logout();
        void this.router.navigateByUrl('/login');
      }

      this.notificationService.warning(message, summary);
      return;
    }

    if (error.status === 403) {
      this.notificationService.warning(message, summary);
      return;
    }

    this.notificationService.error(message, summary);
  }

  private resolveSummary(status: number): string {
    if (status === 0) {
      return 'Connection Error';
    }

    if (status === 401) {
      return 'Unauthorized';
    }

    if (status === 403) {
      return 'Access denied';
    }

    if (status >= 500) {
      return 'Server Error';
    }

    return 'Request Failed';
  }

  private resolveMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Unable to reach the server. Check your connection or try again later.';
    }

    const payload = error.error;

    if (typeof payload === 'string' && payload.trim()) {
      return payload;
    }

    if (Array.isArray(payload?.errors) && payload.errors.length) {
      return payload.errors
        .map((item: unknown) => this.stringifyErrorItem(item))
        .filter(Boolean)
        .join('\n');
    }

    if (payload?.message) {
      return String(payload.message);
    }

    if (error.status === 401) {
      return 'Your session has expired. Please sign in again.';
    }

    if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    }

    if (error.status >= 500) {
      return 'The server could not process the request. Please try again later.';
    }

    return 'The request could not be completed. Please check your input and try again.';
  }

  private stringifyErrorItem(item: unknown): string {
    if (typeof item === 'string') {
      return item;
    }

    if (item && typeof item === 'object' && 'message' in item) {
      return String((item as { message: unknown }).message);
    }

    return '';
  }

  private isAuthEndpoint(url: string): boolean {
    // Do not logout/redirect on 401 coming from any login/register endpoint.
    // Otherwise a login attempt that fails (or gets short-lived 401 due to race)
    // will redirect the user to /login unexpectedly.
    return (
      url.includes('/users/login') ||
      url.includes('/users/register') ||
      url.includes('/admin/auth/login') ||
      url.includes('/instructor/login')
    );
  }
}
