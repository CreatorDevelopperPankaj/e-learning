import { HttpClient } from '@angular/common/http'; import { inject, Injectable } from '@angular/core'; import { environment } from '../../../../environments/environment';
export interface ChatCourse { _id: string; id?: string; title: string; category?: string; coverImageUrl?: string; level?: string }
@Injectable({ providedIn: 'root' }) export class ChatCourseService {
    private http = inject(HttpClient);
    private base = `${environment.apiBaseUrl}/v1/chat/courses`;
    list() {
        return this.http.get<{ success: boolean; data: ChatCourse[] }>(`${this.base}/me`)
    } 
    create(payload: { title: string; description?: string; category?: string }) 
    { return this.http.post<{ success: boolean; data: ChatCourse }>(this.base, payload) } 
    join(courseId: string) { return this.http.post(`${this.base}/${courseId}/join`, {}) 
}
}
