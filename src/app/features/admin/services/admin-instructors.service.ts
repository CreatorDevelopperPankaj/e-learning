import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface AdminInstructorListItem {
  id: string;
  profileImage?: string;
  name: string;
  email: string;
  mobileNumber?: string;
  professionalTitle?: string;
  experienceYears?: string;
  status: string;
}

export interface AdminInstructorsListResponse {
  success: boolean;
  instructors: AdminInstructorListItem[];
}


@Injectable({ providedIn: 'root' })
export class AdminInstructorsService {
  private readonly http = inject(HttpClient);

  getInstructors(): Observable<AdminInstructorsListResponse> {
    const url = `${environment.apiBaseUrl}/admin/instructors`;
    return this.http.get<AdminInstructorsListResponse>(url);
  }

  approveInstructor(id: string): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/instructors/${id}/approve`;
    return this.http.patch(url, {});
  }

  rejectInstructor(id: string): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/instructors/${id}/reject`;
    return this.http.patch(url, {});
  }
}

