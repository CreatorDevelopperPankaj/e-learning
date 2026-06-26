import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { HttpErrorResponse } from '@angular/common/http';

import { NotificationService } from '../../../core/services/notification.service';
import {
  AdminInstructorsService,
  InstructorDetails,
  InstructorDocument,
  InstructorRow,
  InstructorStatus
} from '../../../core/services/admin-instructors.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-instructors',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    TooltipModule,
    SelectModule
  ],
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})
export class AdminInstructorsComponent implements OnInit {

  private readonly notificationService = inject(NotificationService);
  private readonly adminInstructorsService = inject(AdminInstructorsService);
  private readonly cdr = inject(ChangeDetectorRef);

  instructors: InstructorRow[] = [];
  selectedInstructor: InstructorRow | null = null;
  selectedRows: InstructorRow[] = [];

  isLoading = false;
  serverError = '';
  showDetailsPanel = false;

  searchText = '';
  selectedStatus: InstructorStatus | null = null;
  selectedExperience: string | null = null;
  selectedCountry: string | null = null;
  selectedBulkAction: string | null = null;

  statusList = [
    { label: 'All Status',  value: null },
    { label: 'Pending',     value: 'Pending' },
    { label: 'Approved',    value: 'Approved' },
    { label: 'Rejected',    value: 'Rejected' },
    { label: 'Blocked',     value: 'Blocked' }
  ];

  experienceList = [
    { label: 'All Experience', value: null },
    { label: '0-2 Years',  value: '0-2' },
    { label: '3-5 Years',  value: '3-5' },
    { label: '5-10 Years', value: '5-10' },
    { label: '10+ Years',  value: '10+' }
  ];

  countryList = [
    { label: 'All Countries', value: null },
    { label: 'India',  value: 'India' },
    { label: 'USA',    value: 'USA' },
    { label: 'Canada', value: 'Canada' },
    { label: 'UK',     value: 'UK' }
  ];

  bulkActionList = [
    { label: 'Approve Selected', value: 'approve' },
    { label: 'Reject Selected',  value: 'reject' },
    { label: 'Block Selected',   value: 'block' }
  ];

  // ─── Pagination ──────────────────────────────────────────────────────────────

  currentPage = 1;
  pageSize    = 5;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredInstructors.length / this.pageSize));
  }

  get pageStart(): number {
    if (this.filteredInstructors.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredInstructors.length);
  }

  get pagedInstructors(): InstructorRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredInstructors.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    const total   = this.totalPages;
    const current = this.currentPage;
    const delta   = 2;
    const pages: number[] = [];
    const start = Math.max(1, current - delta);
    const end   = Math.min(total, current + delta);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    void this.loadInstructors();
  }

  // ─── Computed counts ─────────────────────────────────────────────────────────

  get pendingCount():  number { return this.instructors.filter(x => x.status === 'Pending').length; }
  get approvedCount(): number { return this.instructors.filter(x => x.status === 'Approved').length; }
  get rejectedCount(): number { return this.instructors.filter(x => x.status === 'Rejected').length; }
  get blockedCount():  number { return this.instructors.filter(x => x.status === 'Blocked').length; }
  get totalCount():    number { return this.instructors.length; }

  // ─── Filtering ───────────────────────────────────────────────────────────────

  get filteredInstructors(): InstructorRow[] {
    return this.instructors.filter(instructor => {
      const matchesSearch =
        !this.searchText ||
        instructor.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        instructor.email.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        !this.selectedStatus || instructor.status === this.selectedStatus;

      const matchesExperience =
        !this.selectedExperience ||
        this.matchExperience(instructor.experienceYears, this.selectedExperience);

      const matchesCountry =
        !this.selectedCountry || instructor.country === this.selectedCountry;

      return matchesSearch && matchesStatus && matchesExperience && matchesCountry;
    });
  }

  private matchExperience(years: string | number, range: string): boolean {
    const y = Number(years);
    switch (range) {
      case '0-2':  return y >= 0  && y <= 2;
      case '3-5':  return y >= 3  && y <= 5;
      case '5-10': return y >= 5  && y <= 10;
      case '10+':  return y > 10;
      default:     return true;
    }
  }

  // ─── Skills helpers ──────────────────────────────────────────────────────────

  getVisibleSkills(row: InstructorRow): string[] {
    return (row.skills || []).slice(0, 2);
  }

  getExtraSkillsCount(row: InstructorRow): number {
    const total = (row.skills || []).length;
    return total > 2 ? total - 2 : 0;
  }

  // ─── Selection helpers ───────────────────────────────────────────────────────

  isSelected(row: InstructorRow): boolean {
    return this.selectedRows.some(r => r.id === row.id);
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  resetFilters(): void {
    this.searchText       = '';
    this.selectedStatus   = null;
    this.selectedExperience = null;
    this.selectedCountry  = null;
    this.currentPage      = 1;
  }

  applyFilters(): void {
    this.cdr.detectChanges();
  }

  async viewInstructor(instructor: InstructorRow): Promise<void> {
    this.selectedInstructor = { ...instructor };
    this.showDetailsPanel = true;
    await this.loadInstructorDetails(instructor.id);
  }

  closeDetailsPanel(): void {
    this.showDetailsPanel = false;
    this.selectedInstructor = null;
  }

  approve(id: string): void { void this.updateStatus(id, 'approve'); }
  reject(id: string):  void { void this.updateStatus(id, 'reject'); }
  block(id: string):   void { void this.updateStatus(id, 'block'); }

  applyBulkAction(): void {
    if (!this.selectedBulkAction || this.selectedRows.length === 0) return;
    const action = this.selectedBulkAction as 'approve' | 'reject' | 'block';
    this.selectedRows.map(r => r.id).forEach(id => void this.updateStatus(id, action));
    this.selectedRows      = [];
    this.selectedBulkAction = null;
  }

  exportCSV(): void {
    const rows = this.filteredInstructors.map(i => ({
      Name: i.name,
      Email: i.email,
      Mobile: i.mobileNumber,
      Title: i.professionalTitle,
      Experience: i.experienceYears,
      Status: i.status,
      Country: i.country || ''
    }));
    const header = Object.keys(rows[0] || {}).join(',');
    const csv    = [header, ...rows.map(r => Object.values(r).join(','))].join('\n');
    const blob   = new Blob([csv], { type: 'text/csv' });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement('a');
    a.href = url; a.download = 'instructors.csv'; a.click();
    URL.revokeObjectURL(url);
    this.notificationService.success('CSV exported successfully');
  }

  // ─── Status badge ────────────────────────────────────────────────────────────

  statusSeverity(status: InstructorStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending':  return 'warn';
      case 'Rejected': return 'danger';
      case 'Blocked':  return 'secondary';
      default:         return 'info';
    }
  }

  // ─── Data loading ────────────────────────────────────────────────────────────

  private async loadInstructors(): Promise<void> {
    this.serverError = '';
    this.isLoading   = true;
    this.cdr.detectChanges();

    try {
      const response = await this.adminInstructorsService.getInstructors().toPromise();

      this.instructors = (response?.instructors || []).map(i => ({
        ...i,
        profileImage: i.profileImage ? `${environment.imageUrl}${i.profileImage}` : '',
        skills:    i.skills    || [],
        documents: i.documents || []
      }));

    } catch (error) {
      const err = error as HttpErrorResponse;
      this.serverError = err.error?.message || 'Unable to load instructors';
      this.notificationService.error(this.serverError);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private async loadInstructorDetails(id: string): Promise<void> {
    try {
      const res        = await this.adminInstructorsService.getInstructorDetails(id).toPromise();
      const instructor = res?.instructor;
      if (!instructor) return;

      this.selectedInstructor = {
        ...(this.selectedInstructor ?? { id } as InstructorRow),
        profileImage:      instructor.profilePhoto
                             ? `${environment.imageUrl}${instructor.profilePhoto}`
                             : (this.selectedInstructor?.profileImage ?? ''),
        name:              instructor.name,
        email:             instructor.email,
        mobileNumber:      instructor.mobileNumber,
        professionalTitle: instructor.professionalTitle,
        experienceYears:   instructor.experienceYears,
        skills:            instructor.skills,
        bio:               instructor.bio,
        status:            instructor.status,
        documents:         this.selectedInstructor?.documents ?? []
      };

      this.cdr.detectChanges();
    } catch (error) {
      const err = error as HttpErrorResponse;
      this.serverError = err.error?.message || 'Unable to load instructor details';
      this.notificationService.error(this.serverError);
      this.cdr.detectChanges();
    }
  }

  private async updateStatus(id: string, action: 'approve' | 'reject' | 'block'): Promise<void> {
    try {
      await this.adminInstructorsService.updateInstructorStatus(id, action).toPromise();

      const label = action.charAt(0).toUpperCase() + action.slice(1);
      this.notificationService.success(`Instructor ${label}d successfully`);
      if (this.selectedInstructor?.id === id) {
        const statusMap: Record<string, InstructorStatus> = {
          approve: 'Approved', reject: 'Rejected', block: 'Blocked'
        };
        this.selectedInstructor = { ...this.selectedInstructor, status: statusMap[action] };
      }

      await this.loadInstructors();

    } catch (error) {
      const err = error as HttpErrorResponse;
      this.serverError = err.error?.message || 'Unable to update instructor status';
      this.notificationService.error(this.serverError);
      this.cdr.detectChanges();
    }
  }
}