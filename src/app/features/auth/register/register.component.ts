import {
  Component,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService, RegisterRequest } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';



export type RegistrationStep = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private readonly fb      = inject(FormBuilder);
  private readonly auth    = inject(AuthService);

  private readonly notif   = inject(NotificationService);
  private readonly router  = inject(Router);
  private readonly cdr     = inject(ChangeDetectorRef);


  // ── Wizard step ────────────────────────────────────────────────────────────
  currentStep = signal<RegistrationStep>(1);

  readonly steps: { id: RegistrationStep; label: string }[] = [
    { id: 1, label: 'Personal Info'  },
    { id: 2, label: 'Address Info'   },
    { id: 3, label: 'Academic Info'  },
    { id: 4, label: 'Review & Submit'}
  ];

  // ── Profile photo ──────────────────────────────────────────────────────────
  photoPreview: string | null = null;
  photoFile: File | null = null;

  // ── State ──────────────────────────────────────────────────────────────────
  isSubmitting = false;
  serverError  = '';

  // ── Dropdown options ───────────────────────────────────────────────────────
  readonly genderOptions  = ['Male', 'Female', 'Other', 'Prefer not to say'];
  readonly countryOptions = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'Other'];
  readonly stateOptions   = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Other'];
  readonly districtOptions = ['Central', 'North', 'South', 'East', 'West', 'Other'];
  readonly courseOptions  = ['Angular Masterclass', 'React Bootcamp', 'Node.js API', 'Python Basics', 'Data Science', 'UI/UX Design'];
  readonly batchOptions   = ['Batch 2024-A', 'Batch 2024-B', 'Batch 2025-A'];
  readonly statusOptions  = ['Active', 'Inactive'];
  readonly progressOptions = ['0%', '10%', '25%', '50%', '75%', '100%'];

  // ── Step 1: Personal Info ──────────────────────────────────────────────────
  readonly step1 = this.fb.nonNullable.group(
    {
      firstName:       ['', [Validators.required, Validators.minLength(2)]],
      middleName:      [''],
      lastName:        ['', [Validators.required]],
      email:           ['', [Validators.required, Validators.email]],
      phone:           ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{7,20}$/)]],
      dob:             ['', [Validators.required]],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      gender:          ['', [Validators.required]]
    },
    { validators: RegisterComponent.passwordsMatch }
  );

  // ── Step 2: Address Info ───────────────────────────────────────────────────
  readonly step2 = this.fb.nonNullable.group({
    country:  ['', [Validators.required]],
    state:    ['', [Validators.required]],
    district: ['', [Validators.required]],
    city:     ['', [Validators.required]],
    address:  ['', [Validators.required]],
    zip:      ['', [Validators.required]]
  });

  // ── Step 3: Academic Info ──────────────────────────────────────────────────
  readonly step3 = this.fb.nonNullable.group({
    course:         ['', [Validators.required]],
    batch:          [''],
    enrollmentDate: ['', [Validators.required]],
    joiningDate:    ['', [Validators.required]],
    status:         ['', [Validators.required]],
    initialProgress:['0%']
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  next(): void {
    const step = this.currentStep();
    if (step === 1) {
      if (!this.photoFile) {
        this.notif.error('Please upload a profile photo');
        return;
      }
      if (this.step1.invalid) { this.step1.markAllAsTouched(); return; }
    }
    if (step === 2 && this.step2.invalid) { this.step2.markAllAsTouched(); return; }
    if (step === 3 && this.step3.invalid) { this.step3.markAllAsTouched(); return; }
    if (step < 4) this.currentStep.set((step + 1) as RegistrationStep);
  }



  back(): void {
    const step = this.currentStep();
    if (step > 1) this.currentStep.set((step - 1) as RegistrationStep);
  }

  goToStep(step: RegistrationStep): void {
    // Only allow going back to already-visited steps
    if (step < this.currentStep()) this.currentStep.set(step);
  }

  // ── Photo upload ───────────────────────────────────────────────────────────

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) { this.notif.error('Please select an image file'); return; }
    if (file.size > 2 * 1024 * 1024) { this.notif.error('Image must be 2MB or smaller'); return; }
    this.photoFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.photoPreview = reader.result as string; this.cdr.markForCheck(); };
    reader.readAsDataURL(file);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  private buildStudentBio(): string {
    const s3 = this.step3.getRawValue();
    const s2 = this.step2.getRawValue();

    // Backend currently persists only bio/country/city for students.
    // Encode the wizard academic + address details into bio.
    return [
      `State: ${s2.state}`,
      `District: ${s2.district}`,
      `Address: ${s2.address}`,
      `Zip: ${s2.zip}`,
      `Course: ${s3.course}`,
      `Batch: ${s3.batch || 'N/A'}`,
      `Enrollment Date: ${s3.enrollmentDate}`,
      `Joining Date: ${s3.joiningDate}`,
      `Status: ${s3.status}`,
      `Initial Progress: ${s3.initialProgress}`
    ].join(' | ');
  }

  submit(): void {
    this.serverError = '';

    if (this.step1.invalid || this.step2.invalid || this.step3.invalid) {
      this.notif.error('Please complete all required fields');
      return;
    }

    if (!this.photoFile) {
      this.notif.error('Please upload a profile photo');
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const s1 = this.step1.getRawValue();
    const s2 = this.step2.getRawValue();

    const payload: RegisterRequest = {
      name: `${s1.firstName} ${s1.lastName}`.trim(),
      email: s1.email,
      mobileNumber: s1.phone,
      password: s1.password,
      role: 'student',
      roleId: 1,

      // Backend persists bio/country/city only for student accounts.
      bio: this.buildStudentBio(),
      country: s2.country,
      city: s2.city
    };

    // POST /api/users/register expects multipart (profilePhoto)
    const formData = new FormData();
    formData.append('profilePhoto', this.photoFile);
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, String(v));
    });

    this.auth.register(formData as any).subscribe({

      next: () => {
        this.notif.success('Account created successfully!');
        void this.router.navigateByUrl('/student/dashboard');
      },
      error: (err: HttpErrorResponse) => {
        this.serverError = err.error?.message || 'Unable to create account. Please try again.';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });

  }


  // ── Review helpers ─────────────────────────────────────────────────────────

  get reviewData() {
    const s1 = this.step1.getRawValue();
    const s2 = this.step2.getRawValue();
    const s3 = this.step3.getRawValue();
    return { ...s1, ...s2, ...s3 };
  }

  // ── Validators ─────────────────────────────────────────────────────────────

  private static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const pw  = control.get('password')?.value;
    const cpw = control.get('confirmPassword')?.value;
    if (!pw || !cpw) return null;
    return pw === cpw ? null : { passwordMismatch: true };
  }

  // ── Step form getter ───────────────────────────────────────────────────────

  isStepDone(step: RegistrationStep): boolean {
    return step < this.currentStep();
  }
}
