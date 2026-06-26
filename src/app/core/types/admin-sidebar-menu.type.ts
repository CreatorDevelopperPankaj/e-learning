import { MenuItem } from 'primeng/api';

export type AdminSidebarIcon = string;

// Backend response -> frontend menu model
export interface AdminSidebarMenuResponse {
  success: boolean;
  data: {
    items: Array<{
      key: string;
      label: string;
      icon: AdminSidebarIcon;
      // for leaf items
      routerLink?: string;
      // for group items
      children?: Array<{
        key: string;
        label: string;
        icon: AdminSidebarIcon;
        routerLink: string;
      }>;
    }>;
  };
}

// Helper type for mapping to PrimeNG MenuItem
export type PrimeAdminMenuItem = MenuItem;

