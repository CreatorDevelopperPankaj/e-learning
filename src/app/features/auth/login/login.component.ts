import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';
import { UserModel } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb     = inject(FormBuilder);
  private readonly auth   = inject(AuthService);
  private readonly notif  = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly cdr    = inject(ChangeDetectorRef);

  readonly loginForm = this.fb.nonNullable.group({
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', [Validators.required]],
    rememberMe: [true]
  });

  isSubmitting = false;
  serverError  = '';
  showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  submit(): void {
    this.serverError = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const { email, password, rememberMe } = this.loginForm.getRawValue();

    this.auth.login({ email, password }, rememberMe).subscribe({
      next: ({ user }) => {
        this.notif.success('Signed in successfully.');
        void this.router.navigateByUrl(this.getDashboardUrl(user));
      },
      error: (err: HttpErrorResponse) => {
        this.serverError =
          err.error?.message || 'Invalid credentials. Please try again.';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  private getDashboardUrl(user: UserModel): string {
    if (user.role === 'admin'      || user.roleId === 3) return '/admin/dashboard';
    if (user.role === 'instructor' || user.roleId === 2) return '/instructor/dashboard';
    return '/student/dashboard';
  }
}