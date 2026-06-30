import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type StudentTab = 'all' | 'pending' | 'reviewed';

export interface StudentWork {
  id: number;
  avatar: string;
  name: string;
  email: string;

  assignment: string;
  fileInfo: string;

  course: string;
  courseType: string;

  submittedOn: string;
  submittedTime: string;

  status: 'Pending' | 'Reviewing' | 'Reviewed';

  comments: number;
}

@Component({
  selector: 'app-instructor-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorStudentsComponent {

  search = signal('');

  activeTab = signal<StudentTab>('all');

  currentPage = signal(1);

  readonly pageSize = 5;

  statCards = [
    {
      title: 'Total Students',
      value: 128,
      subtitle: 'Enrolled in your courses',
      icon: 'pi pi-users',
      bg: '#F3E8FF',
      color: '#7C3AED'
    },
    {
      title: 'Submitted Works',
      value: 84,
      subtitle: 'This month',
      icon: 'pi pi-file',
      bg: '#DCFCE7',
      color: '#16A34A'
    },
    {
      title: 'Pending Review',
      value: 23,
      subtitle: 'Needs your attention',
      icon: 'pi pi-clock',
      bg: '#FFF7ED',
      color: '#EA580C'
    },
    {
      title: 'Reviewed',
      value: 61,
      subtitle: 'Completed reviews',
      icon: 'pi pi-check-circle',
      bg: '#DBEAFE',
      color: '#2563EB'
    }
  ];

  tabs: { key: StudentTab; label: string }[] = [
    {
      key: 'all',
      label: 'All Works'
    },
    {
      key: 'pending',
      label: 'Pending Review'
    },
    {
      key: 'reviewed',
      label: 'Reviewed'
    }
  ];

  works: StudentWork[] = [
    {
      id: 1,
      avatar: 'RS',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      assignment: 'Angular Project - Phase 1',
      fileInfo: '2 Files • 12.4 MB',
      course: 'Angular Advanced',
      courseType: 'purple',
      submittedOn: 'May 28, 2025',
      submittedTime: '10:30 AM',
      status: 'Pending',
      comments: 2
    },
    {
      id: 2,
      avatar: 'PV',
      name: 'Priya Verma',
      email: 'priya@example.com',
      assignment: 'Component Design System',
      fileInfo: '1 File • 8.7 MB',
      course: 'UI/UX Design',
      courseType: 'blue',
      submittedOn: 'May 27, 2025',
      submittedTime: '04:15 PM',
      status: 'Reviewing',
      comments: 1
    },
    {
      id: 3,
      avatar: 'AG',
      name: 'Aman Gupta',
      email: 'aman@example.com',
      assignment: 'TypeScript Basics Quiz',
      fileInfo: 'Quiz • 25 Answers',
      course: 'TypeScript Basics',
      courseType: 'green',
      submittedOn: 'May 27, 2025',
      submittedTime: '11:20 AM',
      status: 'Reviewed',
      comments: 0
    },
    {
      id: 4,
      avatar: 'SR',
      name: 'Sneha Reddy',
      email: 'sneha@example.com',
      assignment: 'Node.js API Development',
      fileInfo: '3 Files • 15.8 MB',
      course: 'Node.js Guide',
      courseType: 'orange',
      submittedOn: 'May 26, 2025',
      submittedTime: '09:45 PM',
      status: 'Pending',
      comments: 3
    },
    {
      id: 5,
      avatar: 'VS',
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      assignment: 'React Hooks Assignment',
      fileInfo: '1 File • 6.3 MB',
      course: 'React for Beginners',
      courseType: 'pink',
      submittedOn: 'May 26, 2025',
      submittedTime: '02:30 PM',
      status: 'Reviewed',
      comments: 0
    }
  ];

  filteredWorks = computed(() => {

    const query = this.search().trim().toLowerCase();
    const tab = this.activeTab();

    return this.works.filter(work => {

      const matchesSearch =
        work.name.toLowerCase().includes(query) ||
        work.assignment.toLowerCase().includes(query) ||
        work.course.toLowerCase().includes(query);

      const matchesTab =
        tab === 'all'
          ? true
          : tab === 'pending'
          ? work.status === 'Pending'
          : work.status === 'Reviewed';

      return matchesSearch && matchesTab;

    });

  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredWorks().length / this.pageSize))
  );

  pageNumbers = computed(() =>
    Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    )
  );

  pagedWorks = computed(() => {

    const start = (this.currentPage() - 1) * this.pageSize;

    return this.filteredWorks().slice(
      start,
      start + this.pageSize
    );

  });

  selectTab(tab: StudentTab): void {

    this.activeTab.set(tab);

    this.currentPage.set(1);

  }

  goToPage(page: number): void {

    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }

  }

  prev(): void {

    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }

  }

  next(): void {

    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }

  }

}