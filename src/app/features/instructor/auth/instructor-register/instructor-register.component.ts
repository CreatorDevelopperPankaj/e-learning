import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatError } from '@angular/material/form-field';

import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-instructor-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatError,
  ],
  templateUrl: './instructor-register.component.html',
  styleUrls: ['./instructor-register.component.scss']
})
export class InstructorRegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly registerForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{7,20}$/)]],

    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],

    profilePhoto: ['', [Validators.required]],

    professionalTitle: ['', [Validators.required]],
    experienceYears: [0, [Validators.required, Validators.min(0)]],
    skills: this.fb.nonNullable.array<string>([]),
    skillsText: [''],

    bio: ['', [Validators.required, Validators.minLength(10)]],

    linkedInUrl: [''],
    githubUrl: [''],
    portfolioWebsite: [''],
    youtubeChannel: ['']
  });

  isSubmitting = false;
  serverError = '';

  selectedFile: File | null = null;
  profilePreview: string | null = null;

  get skillsArray(): FormArray {
    return this.registerForm.controls.skills as unknown as FormArray;
  }

  addSkillFromText(): void {
    const textCtrl = this.registerForm.controls.skillsText;
    const value = (textCtrl.value || '').trim();
    if (!value) return;

    const skills = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const s of skills) {
      this.skillsArray.push(this.fb.control(s));
    }

    textCtrl.setValue('');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.serverError = 'Only JPG, PNG, or WebP images are allowed.';
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.serverError = 'Profile photo must be less than 5MB.';
      return;
    }

    this.serverError = '';
    this.selectedFile = file;
    this.registerForm.controls.profilePhoto.setValue(file.name);
    this.registerForm.controls.profilePhoto.markAsTouched();

    const reader = new FileReader();
    reader.onload = () => {
      this.profilePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  submit(): void {
    this.serverError = '';

    if (!this.selectedFile) {
      this.registerForm.controls.profilePhoto.markAsTouched();
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();
    if (formValue.password !== formValue.confirmPassword) {
      this.serverError = 'Password and Confirm Password do not match';
      return;
    }

    if (!formValue.skills?.length) {
      this.serverError = 'Skills are required';
      return;
    }

    this.isSubmitting = true;

    const fd = new FormData();
    fd.append('fullName', formValue.fullName);
    fd.append('email', formValue.email);
    fd.append('mobileNumber', formValue.mobileNumber);
    fd.append('password', formValue.password);
    fd.append('confirmPassword', formValue.confirmPassword);
    fd.append('profilePhoto', this.selectedFile!);
    fd.append('professionalTitle', formValue.professionalTitle);
    fd.append('experienceYears', String(formValue.experienceYears));
    formValue.skills.forEach((s: string) => fd.append('skills', s));
    fd.append('bio', formValue.bio);
    if (formValue.linkedInUrl) fd.append('linkedInUrl', formValue.linkedInUrl);
    if (formValue.githubUrl) fd.append('githubUrl', formValue.githubUrl);
    if (formValue.portfolioWebsite) fd.append('portfolioWebsite', formValue.portfolioWebsite);
    if (formValue.youtubeChannel) fd.append('youtubeChannel', formValue.youtubeChannel);

    this.authService
      .instructorRegister(fd)
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Registration Successful. Your account is pending admin approval.'
          );
          this.router.navigateByUrl('/instructor/login');
        },
        error: (error: HttpErrorResponse) => {
          this.serverError = error.error?.message || 'Unable to register. Please try again.';
          this.isSubmitting = false;
        }
      });
  }
}

