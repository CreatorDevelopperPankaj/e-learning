import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe, LowerCasePipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from 'primeng/datepicker';

import { Subject, forkJoin, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, catchError } from 'rxjs/operators';

import { NotificationService } from '../../../core/services/notification.service';
import {
  AdminStudentsService,
  StudentRow,
  StudentStatus,
  StudentListParams,
  StudentsDashboardStats
} from '../services/admin-students.service';

// ── Re-export so HTML still works with the local type alias ──────────────────
export type { StudentStatus, StudentRow };

@Component({
  selector: 'app-admin-students',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    LowerCasePipe,
    DecimalPipe,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    TooltipModule,
    SelectModule,
    RippleModule,
    DialogModule,
    PasswordModule,
    DatePickerModule
  ],
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.scss']
})
export class AdminStudentsComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly notif = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly studentsService = inject(AdminStudentsService);

  // ── Avatar fallback — inline SVG, zero network requests ──────────────────
  readonly avatarFallback =
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='40' fill='%23e5e7eb'/%3E%3Ccircle cx='40' cy='30' r='14' fill='%239ca3af'/%3E%3Cellipse cx='40' cy='62' rx='22' ry='14' fill='%239ca3af'/%3E%3C/svg%3E`;

  // ── Table state ────────────────────────────────────────────────────────────
  students: StudentRow[] = [];
  selectedRows: StudentRow[] = [];
  selectedStudent: StudentRow | null = null;

  // ── Dashboard stats ────────────────────────────────────────────────────────
  stats: StudentsDashboardStats = { total: 0, active: 0, suspended: 0, newThisMonth: 0 };

  // ── Loading / error ────────────────────────────────────────────────────────
  isLoading = false;
  serverError = '';

  // ── Edit dialog ────────────────────────────────────────────────────────────
  visible = false;
  form: FormGroup | null = null;
  avatarPreview: string | null = null;
  avatarFile: File | null = null;
  isSaving = false;
  editingStudent: StudentRow | null = null;
  isButtonDisabled: boolean = true;
  // ── Dropdown options ───────────────────────────────────────────────────────
  readonly statusList = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Suspended', value: 'Suspended' }
  ];

  readonly countryList = [
    { label: 'All Countries', value: null },
    { label: 'India', value: 'India' },
    { label: 'USA', value: 'USA' },
    { label: 'Canada', value: 'Canada' },
    { label: 'UK', value: 'UK' }
  ];

  readonly genderList = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  // ── Filters ────────────────────────────────────────────────────────────────
  searchText = '';
  selectedStatus: StudentStatus | null = null;
  selectedCountry: string | null = null;

  // ── Pagination (server-side) ───────────────────────────────────────────────
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  readonly pageSize = 10;

  // ── Search stream ──────────────────────────────────────────────────────────
  private readonly search$ = new Subject<string>();

  // ── Stat shortcuts (from dashboard stats) ─────────────────────────────────
  get activeCount(): number { return this.stats.active; }
  get suspendedCount(): number { return this.stats.suspended; }
  get newRegistrationsCount(): number { return this.stats.newThisMonth; }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.initSearchStream();
    this.loadDashboard();
    this.loadStudents();
  }

  // ── Data loading ───────────────────────────────────────────────────────────

  private loadDashboard(): void {
    this.studentsService.getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.stats = res.stats;
            this.cdr.markForCheck();
          }
        },
        error: () => { /* stats are non-critical, fail silently */ }
      });
  }

  loadStudents(page = this.currentPage): void {
    this.isLoading = true;
    this.serverError = '';
    this.cdr.markForCheck();

    const params: StudentListParams = {
      page,
      limit: this.pageSize,
      q: this.searchText || undefined,
      status: (this.selectedStatus ?? '') as StudentStatus | ''
    };

    this.studentsService.getStudents(params)
      .pipe(
        finalize(() => { this.isLoading = false; this.cdr.markForCheck(); }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.students = res.students;
            this.currentPage = res.pagination.page;
            this.totalPages = res.pagination.totalPages;
            this.totalCount = res.pagination.total;
            this.stats = { ...this.stats, total: res.pagination.total };
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          this.serverError = err?.error?.message || 'Unable to load students';
          this.notif.error(this.serverError);
        }
      });
  }

  // ── Search ─────────────────────────────────────────────────────────────────

  private initSearchStream(): void {
    this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadStudents(1);
    });
  }

  onSearchInput(value: string): void {
    this.searchText = value;
    this.search$.next(value);
  }

  // ── Filters ────────────────────────────────────────────────────────────────

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadStudents(1);
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedStatus = null;
    this.selectedCountry = null;
    this.currentPage = 1;
    this.loadStudents(1);
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadStudents(1);
  }

  // ── Pagination ─────────────────────────────────────────────────────────────

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.loadStudents(page);
  }

  // ── Table passthrough (used by HTML) ───────────────────────────────────────

  get pagedStudents(): StudentRow[] { return this.students; }

  // ── Row actions ────────────────────────────────────────────────────────────


  editStudent(student: StudentRow): void {
    this.editingStudent = student;
    this.visible = true;
    this.avatarPreview = student.profileImageFullUrl || student.profileImage || null;
    this.avatarFile = null;

    this.form = this.fb.group({
      fullName: [student.name, [Validators.required]],
      email: [student.email, [Validators.required, Validators.email]],
      phone: [student.mobileNumber || ''],
      country: [student.country || ''],
      bio: [student.bio || ''],
      status: [student.status],
      password: [''],
      confirmPassword: ['']
    });

    this.form.get('fullName')?.disable();
    this.form.get('email')?.disable();
    this.form.get('phone')?.disable();
    this.form.get('country')?.disable();
    this.form.get('bio')?.disable();
    this.form.get('status')?.disable();
    this.form.get('password')?.disable();
    this.form.get('confirmPassword')?.disable();
    this.form.get('email')?.disable();
    this.form.get('email')?.disable();
    this.form.get('email')?.disable();
    this.cdr.markForCheck();
  }

  onCancel(): void {
    this.visible = false;
    this.form = null;
    this.avatarPreview = null;
    this.avatarFile = null;
    this.editingStudent = null;
    this.isSaving = false;
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (!this.form || !this.editingStudent) { this.onCancel(); return; }
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const id = this.editingStudent.id;
    const { fullName, email, phone, country, bio, status, password, confirmPassword } =
      this.form.value as Record<string, string>;

    // Validate password match before firing any request
    if (password && password.trim().length > 0) {
      if (password.trim().length < 8) {
        this.notif.error('Password must be at least 8 characters');
        return;
      }
      if (password !== confirmPassword) {
        this.notif.error('Passwords do not match');
        return;
      }
    }

    this.isSaving = true;
    this.cdr.markForCheck();

    // ── Build an array of observables for every change ──────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calls: Array<ReturnType<typeof of<any>>> = [];

    // 1. Core profile fields update (always send)
    calls.push(
      this.studentsService.updateStudent(id, {
        name: fullName,
        email: email,
        mobileNumber: phone,
        country: country,
        bio: bio
      }).pipe(catchError(err => {
        this.notif.error(err?.error?.message || 'Profile update failed');
        return of(null);
      }))
    );

    // 2. Profile image — only if a new file was chosen
    if (this.avatarFile) {
      calls.push(
        this.studentsService.updateProfileImage(id, this.avatarFile).pipe(
          catchError(() => { this.notif.error('Profile image upload failed'); return of(null); })
        )
      );
    }

    // 3. Password — only if filled
    if (password && password.trim().length >= 8) {
      calls.push(
        this.studentsService.changePassword(id, password.trim()).pipe(
          catchError(() => { this.notif.error('Password change failed'); return of(null); })
        )
      );
    }

    // 4. Status — only if changed
    const currentStatus = this.editingStudent.status;
    if (status && status !== currentStatus) {
      const statusCall$ = status === 'Active'
        ? this.studentsService.activateStudent(id)
        : this.studentsService.suspendStudent(id);
      calls.push(
        statusCall$.pipe(
          catchError(() => { this.notif.error('Status update failed'); return of(null); })
        )
      );
    }

    // ── Fire all calls, then close dialog and reload list ───────────────────
    forkJoin(calls)
      .pipe(
        finalize(() => { this.isSaving = false; this.cdr.markForCheck(); }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.notif.success('Student updated successfully');
          this.onCancel();
          this.loadStudents(this.currentPage); // reload same page
        },
        error: () => {
          this.notif.error('Update failed');
          this.isSaving = false;
          this.cdr.markForCheck();
        }
      });
  }

  // ── Individual actions ─────────────────────────────────────────────────────

  suspend(id: string): void {
    this.studentsService.suspendStudent(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.students = this.students.map(s => s.id === id ? { ...s, status: res.status } : s);
          this.notif.success('Student suspended');
          this.cdr.markForCheck();
        },
        error: () => this.notif.error('Failed to suspend student')
      });
  }

  activate(id: string): void {
    this.studentsService.activateStudent(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.students = this.students.map(s => s.id === id ? { ...s, status: res.status } : s);
          this.notif.success('Student activated');
          this.cdr.markForCheck();
        },
        error: () => this.notif.error('Failed to activate student')
      });
  }

  viewCertificate(student: StudentRow): void {
    this.studentsService.getCertificates(student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (!res.certificates?.length) {
            this.notif.info('No certificates found for this student');
          }
          // TODO: open certificate modal
        },
        error: () => this.notif.error('Could not fetch certificates')
      });
  }

  // ── Bulk actions ───────────────────────────────────────────────────────────

  bulkDelete(): void {
    if (!this.selectedRows.length) return;
    const ids = this.selectedRows.map(r => r.id);

    this.studentsService.bulkDelete(ids)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.selectedRows = [];
          this.notif.success(res.message);
          this.loadStudents();
        },
        error: () => this.notif.error('Bulk delete failed')
      });
  }

  bulkAction(action: 'suspend' | 'activate'): void {
    if (!this.selectedRows.length) return;
    const ids = this.selectedRows.map(r => r.id);

    const action$ = action === 'suspend'
      ? this.studentsService.bulkSuspend(ids)
      : this.studentsService.bulkActivate(ids);

    action$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.selectedRows = [];
          this.notif.success(res.message);
          this.loadStudents();
        },
        error: () => this.notif.error(`Bulk ${action} failed`)
      });
  }

  // ── Export ─────────────────────────────────────────────────────────────────

  exportCSV(): void {
    this.studentsService.exportAll({ q: this.searchText, status: this.selectedStatus ?? '' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          this.triggerDownload(blob, 'students.csv');
          this.notif.success('CSV exported');
        },
        error: () => this.notif.error('Export failed')
      });
  }

  exportSelected(): void {
    if (!this.selectedRows.length) return;
    const ids = this.selectedRows.map(r => r.id);

    this.studentsService.exportSelected(ids)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          this.triggerDownload(blob, 'students-selected.csv');
          this.notif.success('CSV exported');
        },
        error: () => this.notif.error('Export failed')
      });
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Avatar ─────────────────────────────────────────────────────────────────

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.notif.error('Please select a valid image.');
      return;
    }

    this.avatarFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  progressClass(progress: number): string {
    if (progress >= 100) return 'progress-bar__fill--full';
    if (progress >= 80) return 'progress-bar__fill--high';
    if (progress >= 40) return 'progress-bar__fill--medium';
    return 'progress-bar__fill--low';
  }

  statusSeverity(status: StudentStatus | string): 'success' | 'info' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'info' | 'danger'> = {
      Active: 'success', Suspended: 'danger', Completed: 'info'
    };
    return map[status] ?? 'secondary';
  }
}
