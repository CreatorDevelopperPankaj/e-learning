import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export type InstructorStatus = 'Pending' | 'Approved' | 'Rejected' | 'Blocked';

export interface InstructorDocument {
  name: string;
  url: string;
}

export interface InstructorRow {
  id: string;
  profileImage?: string;
  name: string;
  email: string;
  mobileNumber: string;
  professionalTitle: string;
  experienceYears: string | number;
  registrationDate: string;
  status: InstructorStatus;
  skills?: string[];
  bio?: string;
  country?: string;
  documents?: InstructorDocument[];
}

export interface InstructorDetails {
  profilePhoto?: string;
  name: string;
  email: string;
  mobileNumber: string;
  professionalTitle: string;
  experienceYears: number | string;
  skills: string[];
  bio: string;
  socialLinks: {
    linkedInUrl: string;
    githubUrl: string;
    portfolioWebsite: string;
    youtubeChannel: string;
  };
  status: InstructorStatus;
  registrationDate: string;
}

@Injectable({ providedIn: 'root' })
export class AdminInstructorsService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  private get authHeader() {
    const accessToken = this.tokenService.getAccessToken();
    return { Authorization: `Bearer ${accessToken ?? ''}` };
  }

  /** GET /admin/instructors */
  getInstructors(): Observable<{ success: boolean; instructors: InstructorRow[] }> {
    return this.http.get<{ success: boolean; instructors: InstructorRow[] }>(
      `${environment.apiBaseUrl}/admin/instructors`,
      { headers: this.authHeader }
    );
  }

  /** GET /admin/instructors/:id */
  getInstructorDetails(id: string): Observable<{ success: boolean; instructor: InstructorDetails }> {
    return this.http.get<{ success: boolean; instructor: InstructorDetails }>(
      `${environment.apiBaseUrl}/admin/instructors/${id}`,
      { headers: this.authHeader }
    );
  }

  /** PATCH /admin/instructors/:id/:action */
  updateInstructorStatus(
    id: string,
    action: 'approve' | 'reject' | 'block'
  ): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${environment.apiBaseUrl}/admin/instructors/${id}/${action}`,
      {},
      { headers: this.authHeader }
    );
  }
}