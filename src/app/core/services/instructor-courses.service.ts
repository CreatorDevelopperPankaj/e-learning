import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class InstructorCoursesService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  // Keep consistent with backend setup.

  private authHeaders(): HttpHeaders {
    const token = this.tokenService.getAccessToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  listMyCourses(params: {
    instructorId: string;
    q?: string;
    category?: string;
  }): Observable<{ courses: any[] }> {
    let httpParams = new HttpParams().set('instructorId', params.instructorId);
    if (params.q) httpParams = httpParams.set('q', params.q);
    if (params.category) httpParams = httpParams.set('category', params.category);

    return this.http.get<{ courses: any[] }>(`${environment.apiBaseUrl}/courses`, {
      headers: this.authHeaders(),
      params: httpParams,
    });
  }

  createCourse(payload: {
    title: string;
    description?: string;
    category?: string;
    coverImageUrl?: string;
    price?: number;
    level?: string;
    language?: string;
    isPublished: boolean;
  }): Observable<{ course: any }> {
    return this.http.post<{ course: any }>(`${environment.apiBaseUrl}/courses`, payload, {
      headers: this.authHeaders(),
    });
  }

  createSection(payload: {
    courseId: string;
    title: string;
    order?: number;
  }): Observable<{ section: any }> {
    return this.http.post<{ section: any }>(`${environment.apiBaseUrl}/courses/sections`, payload, {
      headers: this.authHeaders(),
    });
  }

  createLecture(payload: {
    sectionId: string;
    title: string;
    order?: number;
    mediaType?: string;
    mediaUrl?: string;
    textContent?: string;
  }): Observable<{ lecture: any }> {
    return this.http.post<{ lecture: any }>(`${environment.apiBaseUrl}/courses/lectures`, payload, {
      headers: this.authHeaders(),
    });
  }

  uploadLectureMedia(payload: {
    sectionId: string;
    media: File;
  }): Observable<{ lecture?: any; media?: any }> {
    const formData = new FormData();
    // backend expects field name: media
    formData.append('media', payload.media);
    // backend uploader controller may use sectionId; send it if it exists in controller.
    formData.append('sectionId', payload.sectionId);

    return this.http.post<{ lecture?: any; media?: any }>(
      `${environment.apiBaseUrl}/courses/lectures/upload`,
      formData,
      {
        headers: this.authHeaders(),
      }
    );
  }
}

