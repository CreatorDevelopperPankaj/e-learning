import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserModel } from '../../../core/models/user.model';

export interface AdminProfileResponse {
  success: boolean;
  profile: UserModel;
}

@Injectable({ providedIn: 'root' })
export class AdminProfileService {
  private readonly http = inject(HttpClient);

  getProfile(): Observable<AdminProfileResponse> {
    const url = `${environment.apiBaseUrl}/admin/profile`;
    return this.http.get<AdminProfileResponse>(url);
  }

  updateProfile(formData: FormData): Observable<AdminProfileResponse> {
    const url = `${environment.apiBaseUrl}/admin/profile`;
    return this.http.put<AdminProfileResponse>(url, formData);
  }
}
