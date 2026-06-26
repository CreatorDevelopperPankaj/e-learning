import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../../core/services/auth.service';

type InstructorDetails = {
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
  status: 'Pending' | 'Approved' | 'Rejected' | 'Blocked';
  registrationDate: string;
};

@Component({
  selector: 'app-instructor-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TagModule, ButtonModule],
  templateUrl: './instructor-details.component.html',
  styleUrls: ['./instructor-details.component.scss']
})
export class InstructorDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  details: InstructorDetails | null = null;
  isLoading = false;
  serverError = '';

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    this.serverError = '';
    this.isLoading = true;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.serverError = 'Instructor id missing';
      this.isLoading = false;
      return;
    }

    try {
      const accessToken = (this.authService as any)?.['tokenService']?.getAccessToken?.() ||
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken');

      const res = await this.http
        .get<{ success: boolean; instructor: InstructorDetails }>(
          `${environment.apiBaseUrl}/admin/instructors/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        .toPromise();

      const instructor = res?.instructor || null;
      if (instructor) {
        instructor.profilePhoto = instructor.profilePhoto
          ? `${environment.apiBaseUrl.replace('/api', '')}/uploads/${instructor.profilePhoto}`
          : '';
      }
      this.details = instructor;
    } catch (e) {
      const err = e as HttpErrorResponse;
      this.serverError = err.error?.message || 'Unable to load instructor';
    } finally {
      this.isLoading = false;
    }
  }

  statusSeverity(status: InstructorDetails['status']): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warn';
      case 'Rejected':
        return 'danger';
      case 'Blocked':
        return 'danger';
    }
  }
}

