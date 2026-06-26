import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { AdminSidebarMenuResponse } from '../../../core/types/admin-sidebar-menu.type';
import { MenuItem } from 'primeng/api';
import { environment } from '../../../../environments/environment';



@Injectable({ providedIn: 'root' })
export class AdminMenuService {
  private readonly http = inject(HttpClient);

  /**
   * API endpoint format (example)
   * GET /api/admin/sidebar
   */
  getSidebarMenu(): Observable<MenuItem[]> {
    const mockUrl = `${environment.apiBaseUrl}/admin/menu-access`;


    return this.http.get<AdminSidebarMenuResponse>(mockUrl).pipe(

      map((res) => {
        if (!res?.success || !res?.data?.items) return [];
        return this.mapToPrimeMenu(res.data.items);
      })
    );
  }

  private mapToPrimeMenu(items: AdminSidebarMenuResponse['data']['items']): MenuItem[] {
    return items.map((group) => {
      const hasChildren = Boolean(group.children?.length);

      if (hasChildren) {
        return {
          label: group.label,
          icon: group.icon,
          items: (group.children ?? []).map((c) => ({
            label: c.label,
            icon: c.icon,
            routerLink: c.routerLink
          }))
        };
      }

      return {
        label: group.label,
        icon: group.icon,
        routerLink: group.routerLink
      } as MenuItem;
    });
  }
}

