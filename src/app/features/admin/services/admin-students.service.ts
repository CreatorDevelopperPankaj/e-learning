import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

// ── Types ─────────────────────────────────────────────────────────────────────

export type StudentStatus = 'Active' | 'Suspended';

export interface StudentRow {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  profileImage?: string;
  profileImageFilePath?: string;
  profileImageFullUrl?: string;
  bio?: string;
  country?: string;
  city?: string;
  isVerified: boolean;
  status: StudentStatus;
  joinedAt: string;
  updatedAt: string;
}

export interface StudentListResponse {
  success: boolean;
  message: string;
  students: StudentRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StudentDetailResponse {
  success: boolean;
  message: string;
  student: StudentRow;
}

export interface StudentStatusResponse {
  success: boolean;
  message: string;
  id: string;
  status: StudentStatus;
  isVerified?: boolean;
}

export interface StudentsDashboardStats {
  total: number;
  active: number;
  suspended: number;
  newThisMonth: number;
}

export interface RegistrationChartPoint {
  label: string;
  count: number;
}

export interface StudentsDashboardResponse {
  success: boolean;
  message: string;
  stats: StudentsDashboardStats;
  registrationChart: RegistrationChartPoint[];
}

export interface BulkOperationResponse {
  success: boolean;
  message: string;
  deletedCount?: number;
  modifiedCount?: number;
}

export interface StudentListParams {
  q?: string;
  status?: StudentStatus | '';
  page?: number;
  limit?: number;
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AdminStudentsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/admin/students`;

  // ── Dashboard ──────────────────────────────────────────────────────────────

  /** GET /api/admin/students/dashboard */
  getDashboard(): Observable<StudentsDashboardResponse> {
    return this.http.get<StudentsDashboardResponse>(`${this.base}/dashboard`);
  }

  // ── List & detail ──────────────────────────────────────────────────────────

  /** GET /api/admin/students */
  getStudents(params: StudentListParams = {}): Observable<StudentListResponse> {
    let httpParams = new HttpParams();
    if (params.q)      httpParams = httpParams.set('q', params.q);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.page)   httpParams = httpParams.set('page', String(params.page));
    if (params.limit)  httpParams = httpParams.set('limit', String(params.limit));

    return this.http.get<StudentListResponse>(this.base, { params: httpParams });
  }

  /** PUT /api/admin/students/:studentId */
  updateStudent(studentId: string, body: {
    name?: string;
    email?: string;
    mobileNumber?: string;
    bio?: string;
    country?: string;
    city?: string;
  }): Observable<StudentDetailResponse> {
    return this.http.put<StudentDetailResponse>(`${this.base}/${studentId}`, body);
  }

  /** GET /api/admin/students/:studentId */
  getStudent(studentId: string): Observable<StudentDetailResponse> {
    return this.http.get<StudentDetailResponse>(`${this.base}/${studentId}`);
  }

  // ── Status ─────────────────────────────────────────────────────────────────

  /** PATCH /api/admin/students/:studentId/activate */
  activateStudent(studentId: string): Observable<StudentStatusResponse> {
    return this.http.patch<StudentStatusResponse>(`${this.base}/${studentId}/activate`, {});
  }

  /** PATCH /api/admin/students/:studentId/suspend */
  suspendStudent(studentId: string): Observable<StudentStatusResponse> {
    return this.http.patch<StudentStatusResponse>(`${this.base}/${studentId}/suspend`, {});
  }

  // ── Profile image ──────────────────────────────────────────────────────────

  /** PUT /api/admin/students/:studentId/profile-image */
  updateProfileImage(studentId: string, file: File): Observable<{ success: boolean; message: string; profileImageFullUrl: string }> {
    const form = new FormData();
    form.append('profileImage', file);
    return this.http.put<{ success: boolean; message: string; profileImageFullUrl: string }>(
      `${this.base}/${studentId}/profile-image`,
      form
    );
  }

  // ── Change password ────────────────────────────────────────────────────────

  /** PATCH /api/admin/students/:studentId/change-password */
  changePassword(studentId: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.base}/${studentId}/change-password`,
      { newPassword }
    );
  }

  // ── Progress & certificates ────────────────────────────────────────────────

  /** GET /api/admin/students/:studentId/progress */
  getProgress(studentId: string): Observable<{ success: boolean; message: string; progress: unknown[] }> {
    return this.http.get<{ success: boolean; message: string; progress: unknown[] }>(
      `${this.base}/${studentId}/progress`
    );
  }

  /** GET /api/admin/students/:studentId/certificate */
  getCertificates(studentId: string): Observable<{ success: boolean; message: string; certificates: unknown[] }> {
    return this.http.get<{ success: boolean; message: string; certificates: unknown[] }>(
      `${this.base}/${studentId}/certificate`
    );
  }

  // ── Bulk operations ────────────────────────────────────────────────────────

  /** DELETE /api/admin/students/bulk-delete */
  bulkDelete(studentIds: string[]): Observable<BulkOperationResponse> {
    return this.http.delete<BulkOperationResponse>(`${this.base}/bulk-delete`, {
      body: { studentIds }
    });
  }

  /** PATCH /api/admin/students/bulk-activate */
  bulkActivate(studentIds: string[]): Observable<BulkOperationResponse> {
    return this.http.patch<BulkOperationResponse>(`${this.base}/bulk-activate`, { studentIds });
  }

  /** PATCH /api/admin/students/bulk-suspend */
  bulkSuspend(studentIds: string[]): Observable<BulkOperationResponse> {
    return this.http.patch<BulkOperationResponse>(`${this.base}/bulk-suspend`, { studentIds });
  }

  // ── Export ─────────────────────────────────────────────────────────────────

  /** GET /api/admin/students/export — triggers CSV download */
  exportAll(params: { q?: string; status?: string } = {}): Observable<Blob> {
    let httpParams = new HttpParams();
    if (params.q)      httpParams = httpParams.set('q', params.q);
    if (params.status) httpParams = httpParams.set('status', params.status);

    return this.http.get(`${this.base}/export`, {
      params: httpParams,
      responseType: 'blob'
    });
  }

  /** POST /api/admin/students/export-selected — CSV for chosen IDs */
  exportSelected(studentIds: string[]): Observable<Blob> {
    return this.http.post(`${this.base}/export-selected`, { studentIds }, {
      responseType: 'blob'
    });
  }
}
