import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { StudentSidebarComponent } from '../../components/student-sidebar/student-sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { StudentBreadcrumbComponent } from '../../components/student-breadcrumb/student-breadcrumb.component';



@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StudentSidebarComponent,
    TopbarComponent,
    StudentBreadcrumbComponent,
    
  ],
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.scss']
})
export class StudentLayoutComponent implements OnInit {

  isCollapsed = false;

  menuItems: MenuItem[] = [];

  ngOnInit(): void {

    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/student/dashboard'
      },
      {
        label: 'My Courses',
        icon: 'pi pi-book',
        routerLink: '/student/my-courses'
      },
      {
        label: 'Wishlist',
        icon: 'pi pi-heart',
        routerLink: '/student/wishlist'
      },
      {
        label: 'Certificates',
        icon: 'pi pi-verified',
        routerLink: '/student/certificates'
      },
      {
        label: 'Assignments',
        icon: 'pi pi-file',
        routerLink: '/student/assignments'
      },
      {
        label: 'Messages',
        icon: 'pi pi-comments',
        routerLink: '/student/messages'
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: '/student/settings'
      }
    ];
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
