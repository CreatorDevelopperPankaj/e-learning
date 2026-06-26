import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class AdminProfileComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  readonly apiBase = environment.apiBaseUrl;

  adminProfile: any = null;
  profilePreview: string | null = null;

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  profileForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', [Validators.required]],
    country: [''],
    city: [''],
    password: [''],
    bio: ['']
  });

  ngOnInit(): void {
    this.fetchProfile();
  }

  private fetchProfile(): void {
    this.http
      .get<any>(`${this.apiBase}/admin/profile`)
      .subscribe({
        next: (res) => {
          const profile = res?.profile;
          this.adminProfile = profile;

          this.profileForm.patchValue({
            name: profile?.name ?? '',
            email: profile?.email ?? '',
            mobileNumber: profile?.mobileNumber ?? '',
            country: profile?.country ?? '',
            city: profile?.city ?? '',
            bio: profile?.bio ?? ''
          });
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Unable to load profile';
        }
      });
  }

  handleImageError(_event?: unknown): void {
    this.profilePreview = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    this.profilePreview = URL.createObjectURL(file);
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.profileForm.getRawValue();

    const formData = new FormData();
    formData.append('name', String(formValue.name ?? ''));
    formData.append('email', String(formValue.email ?? ''));
    formData.append('mobileNumber', String(formValue.mobileNumber ?? ''));
    formData.append('country', String(formValue.country ?? ''));
    formData.append('city', String(formValue.city ?? ''));
    formData.append('bio', String(formValue.bio ?? ''));

    const password = formValue.password;
    if (password !== null && password !== undefined && String(password).trim() !== '') {
      formData.append('password', String(password));
    }

    // If user selected a new file, append it
    const fileInput = document.querySelector<HTMLInputElement>(
      'input[type="file"][accept="image/*"]'
    );
    const file = fileInput?.files?.[0];
    if (file) {
      formData.append('profilePhoto', file);
    }

    this.http
      .put<any>(`${this.apiBase}/admin/profile`, formData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (res) => {
          const profile = res?.profile;
          if (profile) {
            this.adminProfile = profile;
            this.profileForm.patchValue({
              name: profile.name ?? '',
              email: profile.email ?? '',
              mobileNumber: profile.mobileNumber ?? '',
              country: profile.country ?? '',
              city: profile.city ?? '',
              bio: profile.bio ?? ''
            });
          }
          this.successMessage = res?.message || 'Profile updated successfully';
          this.notificationService.success('Profile updated');
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Unable to update profile';
        }
      });
  }
}

