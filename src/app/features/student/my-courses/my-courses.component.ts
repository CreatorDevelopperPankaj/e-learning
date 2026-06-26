import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
interface Course {
  id: string;
  category: string;
  title: string;
  completed: number;
  total: number;
  progress: number;
  background: string;
}
@Component({
  selector: 'app-student-my-courses',
  standalone: true,
  imports: [  CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class StudentMyCoursesComponent implements OnInit {
  constructor(private router: Router) {}

  tabs = [
    'All Courses',
    'Design',
    'Business',
    'Programming',
    'Languages'
  ];

  selectedTab = 'All Courses';

  courses: Course[] = [
    {
      id: 'ux-fundamentals',
      category: 'Design',
      title: 'UX Fundamentals: Crafting Better Interfaces',
      completed: 8,
      total: 24,
      progress: 35,
      background: '#3B5CFF'
    },
    {
      id: 'ui-design-masterclass',
      category: 'Design',
      title: 'UI Design Masterclass',
      completed: 15,
      total: 30,
      progress: 50,
      background: '#4F46E5'
    },
    {
      id: 'startup-finance-essentials',
      category: 'Business',
      title: 'Startup Finance Essentials',
      completed: 15,
      total: 30,
      progress: 50,
      background: '#FF5A36'
    },
    {
      id: 'digital-marketing-strategy',
      category: 'Business',
      title: 'Digital Marketing Strategy',
      completed: 10,
      total: 20,
      progress: 50,
      background: '#F97316'
    },
    {
      id: 'angular-21-complete-guide',
      category: 'Programming',
      title: 'Angular 21 Complete Guide',
      completed: 20,
      total: 25,
      progress: 80,
      background: '#DD0031'
    },
    {
      id: 'nodejs-api-development',
      category: 'Programming',
      title: 'Node.js API Development',
      completed: 10,
      total: 40,
      progress: 25,
      background: '#22C55E'
    },
    {
      id: 'advanced-typescript',
      category: 'Programming',
      title: 'Advanced TypeScript',
      completed: 18,
      total: 24,
      progress: 75,
      background: '#3178C6'
    },
    {
      id: 'conversational-spanish',
      category: 'Languages',
      title: 'Conversational Spanish',
      completed: 18,
      total: 22,
      progress: 82,
      background: '#111111'
    },
    {
      id: 'english-communication-skills',
      category: 'Languages',
      title: 'English Communication Skills',
      completed: 12,
      total: 18,
      progress: 67,
      background: '#0F172A'
    }
  ];

  filteredCourses: Course[] = [];

  lessons = [
    {
      title: 'Introduction to UX Principles',
      subtitle: 'Foundations of user-centered design',
      teacher: 'Alex Chen',
      duration: '20 min',
      teacherImage: 'https://i.pravatar.cc/40?img=21'
    },
    {
      title: 'Color Theory in Digital Design',
      subtitle: 'Understanding palettes and contrasts',
      teacher: 'Mia Roberts',
      duration: '25 min',
      teacherImage: 'https://i.pravatar.cc/40?img=22'
    },
    {
      title: 'Basics of Financial Forecasting',
      subtitle: 'Planning budgets with real data',
      teacher: 'Priya Kapoor',
      duration: '22 min',
      teacherImage: 'https://i.pravatar.cc/40?img=23'
    },
    {
      title: 'Building a Pitch Deck',
      subtitle: 'Creating presentations that win investors',
      teacher: 'Samuel Wright',
      duration: '28 min',
      teacherImage: 'https://i.pravatar.cc/40?img=24'
    }
  ];

  recommendedCourse = {
    id: 'advanced-typography',
    category: 'Design',
    title: 'Advanced Typography for Digital Products'
  };

  ngOnInit(): void {
    this.selectTab('All Courses');
  }

  selectTab(tab: string): void {

    this.selectedTab = tab;

    if (tab === 'All Courses') {
      this.filteredCourses = [...this.courses];
      return;
    }

    this.filteredCourses = this.courses.filter(
      course => course.category === tab
    );
  }

  continueCourse(course: Course): void {
    this.router.navigate(['/student/my-courses', course.id, 'learn']);
  }

  openCourseDetails(courseId: string): void {
    this.router.navigate(['/student/my-courses', courseId, 'details']);
  }
}
