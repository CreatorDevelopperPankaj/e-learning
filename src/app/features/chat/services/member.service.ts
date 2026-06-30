import { HttpClient } from '@angular/common/http'; import { inject, Injectable } from '@angular/core'; import { Observable } from 'rxjs'; import { environment } from '../../../../environments/environment';
export interface CourseMemberView { id: string; name: string; role: string; profileImage: string; status: string }
@Injectable({ providedIn: 'root' }) export class MemberService {
  private http = inject(HttpClient); private base = `${environment.apiBaseUrl}/v1`;
  list(courseId: string): Observable<{ success: boolean; data: CourseMemberView[] }> { return this.http.get<{ success: boolean; data: CourseMemberView[] }>(`${this.base}/courses/${courseId}/members`) }
  progress(courseId: string): Observable<{ success: boolean; data: any }> { return this.http.get<{ success: boolean; data: any }>(`${this.base}/courses/${courseId}/progress/me`) }
}
