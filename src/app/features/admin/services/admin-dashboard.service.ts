import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface ChartJsLikeData {
  labels: string[];
  datasets: Array<{
    label?: string;
    data: number[];
  }>;
}

export interface AdminDashboardStatsResponse {
  success: boolean;
  data: {
    totalUsers: number;
    totalInstructors: number;
    totalStudents: number;
    totalCourses: number;

    revenueData?: ChartJsLikeData;
    userGrowthData?: ChartJsLikeData;
    categoryData?: ChartJsLikeData;
  };
}


@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private readonly http = inject(HttpClient);

  getStats(): Observable<AdminDashboardStatsResponse> {
    const url = `${environment.apiBaseUrl}/admin/dashboard/stats`;
    return this.http.get<AdminDashboardStatsResponse>(url);
  }
}

