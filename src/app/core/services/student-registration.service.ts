import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiConstants } from '../constants/api.constants';

export interface StudentRegisterUploadResponse {
  fileName: string;
  filePath: string;
  fullUrl: string;
}

@Injectable({ providedIn: 'root' })
export class StudentRegistrationService {
  private readonly http = inject(HttpClient);

  uploadProfileImage(file: File): Observable<StudentRegisterUploadResponse> {
    const formData = new FormData();
    formData.append('profileImage', file);

    // Backend endpoint: POST /api/users/profile-image (see Angular Auth + upload middleware)
    return this.http.post<StudentRegisterUploadResponse>(
      `${environment.apiBaseUrl}/users/profile-image`,
      formData
    );
  }

  // NOTE: registration POST uses JSON at /api/users/register
  registerStudent(payload: unknown): Observable<unknown> {
    return this.http.post(
      `${environment.apiBaseUrl}${ApiConstants.auth.register}`,
      payload
    );
  }
}

