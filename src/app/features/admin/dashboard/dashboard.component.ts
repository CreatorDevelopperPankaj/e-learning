import { Component, inject, } from '@angular/core';

import { ButtonModule } from 'primeng/button';

import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { AdminInstructorsService } from '../services/admin-instructors.service';
import { ImageUrlPipe } from '../../../shared/image-url.pipe';
import { environment } from '../../../../environments/environment'
import { Router } from '@angular/router';

interface Instructor {
  id: string;
  name: string;
  email: string;
  exp: string;
  skill: string;
  status: string;
  image: string;
}


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    ButtonModule,

    CardModule,
    ChartModule,
    TableModule,
    TagModule,
    AvatarModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class AdminDashboardComponent {

  private confirmationService = inject(ConfirmationService);
  private adminDashboardService = inject(AdminDashboardService);
  private adminInstructorsService = inject(AdminInstructorsService);
  private router = inject(Router)
  ngOnInit(): void {
    this.adminDashboardService.getStats().subscribe({
      next: (res) => {
        const data = res?.data;
        if (!data) return;

        this.totalUsers = data.totalUsers;
        this.totalInstructors = data.totalInstructors;
        this.totalStudents = data.totalStudents;
        this.totalCourses = data.totalCourses;

        if (data.revenueData) this.revenueData = data.revenueData as any;
        if (data.userGrowthData) this.userGrowthData = data.userGrowthData as any;
        if (data.categoryData) this.categoryData = data.categoryData as any;
      },
      error: () => {
        // keep existing fallback numbers
      }
    });

    this.loadPendingInstructors();
  }



  growthUsers = 3;
  growthInstructors = 1;
  growthStudents = 1;
  growthCourses = 10;

  totalUsers = 12540;


  totalInstructors = 1250;
  totalStudents = 11290;
  totalCourses = 3450;

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [10000, 15000, 12000, 25000, 20000, 35000]
      }
    ]
  };

  userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Students',
        data: [100, 200, 350, 500, 700, 1000]
      },
      {
        label: 'Instructors',
        data: [20, 50, 70, 100, 150, 250]
      }
    ]
  };

  categoryData = {
    labels: [
      'Web Development',
      'Programming',
      'Data Science',
      'Design'
    ],
    datasets: [
      {
        data: [35, 25, 20, 20]
      }
    ]
  };


  instructors: Instructor[] = [];

  trackByInstructorId(_index: number, item: Instructor): string {
    return item.id;
  }

  private loadPendingInstructors(): void {

    this.adminInstructorsService.getInstructors().subscribe({
      next: (res) => {
        console.log('res?.instructors:', res.instructors);
        const all = res?.instructors ?? [];

        const pending = all.filter((i) => i.status === 'Pending');


        this.instructors = pending.map((i) => ({
          id: String(i.id),
          name: i.name ?? '',
          email: i.email ?? '',
          exp: String((i as any).experienceYears ?? ''),
          skill: i.professionalTitle != null ? String(i.professionalTitle) : '',
          status: i.status ?? '',
         image: i.profileImage ? `${environment.imageUrl}${i.profileImage}` : ''
        }));

        console.log('Pending instructors bound:', this.instructors);
      },

      error: () => {
        // keep empty state
      }
    });
  }

  approveInstructor(instructor: Instructor): void {
    this.confirmationService.confirm({
      header: 'Approve Instructor',
      message: `Are you sure you want to approve ${instructor.name}?`,
      icon: 'pi pi-check-circle',
      acceptLabel: 'Approve',
      rejectLabel: 'Cancel',

      accept: () => {
        this.adminInstructorsService.approveInstructor(instructor.id).subscribe({
          next: (res) => {
            // Backend returns: { userId, status }.
            console.log('Approve response:', res);
            this.instructors = this.instructors.filter((x) => x.id !== instructor.id);
          },
          error: (err) => {
            console.error('Approve error:', err);
          }
        });
      }
    });
  }

  rejectInstructor(instructor: Instructor): void {
    this.confirmationService.confirm({
      header: 'Reject Instructor',
      message: `Are you sure you want to reject ${instructor.name}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Reject',
      rejectLabel: 'Cancel',

      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.adminInstructorsService.rejectInstructor(instructor.id).subscribe({
          next: (res) => {
            // Backend returns: { userId, status }.
            console.log('Reject response:', res);
            this.instructors = this.instructors.filter((x) => x.id !== instructor.id);
          },
          error: (err) => {
            console.error('Reject error:', err);
          }
        });
      }
    });
  }

  viewAll(){
    this.router.navigate(['//admin/instructors'])
  }
}

