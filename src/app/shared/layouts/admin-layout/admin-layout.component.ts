import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';

import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { AdminBreadcrumbComponent } from '../../components/admin-breadcrumb/admin-breadcrumb.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserModel } from '../../../core/models/user.model';
import { AdminMenuService } from '../../../features/admin/services/admin-menu.service';


@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminSidebarComponent,
    TopbarComponent,
    AdminBreadcrumbComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isCollapsed = false;

  menuItems: MenuItem[] = [];

  currentUser: UserModel | null = null;

  get userInitials(): string {
    const name = this.currentUser?.name?.trim();
    if (!name) return 'AD';

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  }

  constructor(private authService: AuthService, private adminMenuService: AdminMenuService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((u) => (this.currentUser = u));

    // Dynamic (API driven) admin sidebar menu
    this.adminMenuService.getSidebarMenu().subscribe({
      next: (items) => {
        this.menuItems = items && items.length ? items : [];
      },
      error: () => {
        // this.menuItems = this.getFallbackMenu();
      }
    });
  }

  // private getFallbackMenu(): MenuItem[] {
  //   return [
  //     {
  //       label: 'Dashboard',
  //       icon: 'pi pi-home',
  //       routerLink: '/admin/dashboard'
  //     },
  //     {
  //       label: 'User Management',
  //       icon: 'pi pi-users',
  //       items: [
  //         {
  //           label: 'Students',
  //           icon: 'pi pi-graduation-cap',
  //           routerLink: '/admin/students'
  //         },
  //         {
  //           label: 'Instructors',
  //           icon: 'pi pi-id-card',
  //           routerLink: '/admin/instructors'
  //         },
  //         {
  //           label: 'Admins',
  //           icon: 'pi pi-shield',
  //           routerLink: '/admin/profile'
  //         }
  //       ]
  //     },
  //     {
  //       label: 'Course Management',
  //       icon: 'pi pi-book',
  //       items: [
  //         {
  //           label: 'All Courses',
  //           icon: 'pi pi-list',
  //           routerLink: '/admin/courses'
  //         },
  //         {
  //           label: 'Pending Approval',
  //           icon: 'pi pi-clock',
  //           routerLink: '/admin/courses'
  //         },
  //         {
  //           label: 'Categories',
  //           icon: 'pi pi-tags',
  //           routerLink: '/admin/categories'
  //         }
  //       ]
  //     },
  //     {
  //       label: 'Finance',
  //       icon: 'pi pi-credit-card',
  //       items: [
  //         {
  //           label: 'Revenue',
  //           icon: 'pi pi-chart-line',
  //           routerLink: '/admin/payments'
  //         },
  //         {
  //           label: 'Transactions',
  //           icon: 'pi pi-receipt',
  //           routerLink: '/admin/payments'
  //         }
  //       ]
  //     },
  //     {
  //       label: 'Reports',
  //       icon: 'pi pi-chart-bar',
  //       routerLink: '/admin/reports'
  //     },
  //     {
  //       label: 'Settings',
  //       icon: 'pi pi-sliders-h',
  //       routerLink: '/admin/settings'
  //     }
  //   ];
  // }


  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}

