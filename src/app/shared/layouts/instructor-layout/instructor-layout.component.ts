import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';

import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { AdminBreadcrumbComponent } from '../../components/admin-breadcrumb/admin-breadcrumb.component';

import { AuthService } from '../../../core/services/auth.service';
import { UserModel } from '../../../core/models/user.model';

@Component({
  selector: 'app-instructor-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminSidebarComponent,
    TopbarComponent,
    AdminBreadcrumbComponent
  ],
  templateUrl: './instructor-layout.component.html',
   styleUrls: ['./instructor-layout.component.scss']
})
export class InstructorLayoutComponent implements OnInit {
  isCollapsed = false;

  menuItems: MenuItem[] = [];

  currentUser: UserModel | null = null;

  get userInitials(): string {
    const name = this.currentUser?.name?.trim();
    if (!name) return 'IN';

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((u) => (this.currentUser = u));

    // Instructor sidebar menu (static for now; can be made API-driven later)
    this.menuItems = [
      {
        label: 'Instructor Dashboard',
        icon: 'pi pi-chart-bar',
        routerLink: ['/instructor/dashboard']
      },
      {
        label: 'Course Builder',
        icon: 'pi pi-plus-circle',
        routerLink: ['/instructor/course-builder']
      },
      {
        label: 'My Courses',
        icon: 'pi pi-folder',
        routerLink: ['/instructor/my-courses']
      },
      {
        label: 'My Students',
        icon: 'pi pi-users',
        routerLink: ['/instructor/students']
      },
      {
        label: 'Earnings & Sales',
        icon: 'pi pi-dollar',
        routerLink: ['/instructor/earnings']
      },
      {
        label: 'Analytics Reports',
        icon: 'pi pi-line-chart',
        routerLink: ['/instructor/analytics']
      }
    ];
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}


