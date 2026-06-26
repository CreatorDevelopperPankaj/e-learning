import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SliderComponent } from '../../../shared/components/slider/slider.component';
import { LearningOverview } from '../../../shared/components/learning-overview/learning-overview';
import { MyCertificates } from '../../../shared/components/my-certificates/my-certificates';
import { UpcomingDeadlines } from '../../../shared/components/upcoming-deadlines/upcoming-deadlines';
import { RecentActivity } from '../../../shared/components/recent-activity/recent-activity';
import { MatGridListModule } from '@angular/material/grid-list';
interface PopularCourse {
  title: string;
  label: string;
  booked: number;
  accent: string;
  art: string;
}

interface CourseRow {
  title: string;
  subtitle: string;
  icon: string;
  rating: number;
}

interface NewsItem {
  title: string;
  category: string;
  image: string;
}

interface DashboardCourse {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
  rating: number;
  lessons: number;
  duration: string;
  lastAccess: string;
  buttonText: string;
  color: string;
}

type PopularCourseCard = {
  id: string;
  title: string;
  shortDescription: string;
  thumbnail: string;
  rating: number;
  totalStudents: number;
  duration: string;
  currency: string;
  discountPrice: number;
  price: number;
  instructorName: string;
  slug?: string;
};


@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatCardModule,
    MatButtonModule, MatIconModule, SliderComponent,
     LearningOverview, MyCertificates, UpcomingDeadlines, RecentActivity ,MatGridListModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class StudentDashboardComponent {
  constructor(private router: Router) {}

  popularCourses: PopularCourseCard[] = [];


  isCollapsed = false;

  students = [
    {
      name: 'John',
      course: 'Angular',
      status: 'Active'
    },
    {
      name: 'David',
      course: 'NodeJS',
      status: 'Active'
    },
    {
      name: 'Alex',
      course: 'React',
      status: 'Active'
    }
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  readonly menuItems = [
    { label: 'Dashboard', icon: 'pi pi-th-large', active: true },
    { label: 'Profile', icon: 'pi pi-user' },
    { label: 'Courses', icon: 'pi pi-lightbulb' },
    { label: 'Message', icon: 'pi pi-comments' },
    { label: 'Setting', icon: 'pi pi-cog' }
  ];



  readonly courseRows: CourseRow[] = [
    {
      title: 'Adobe Photoshop CC 2019 - Free Essentials Training Course',
      subtitle: 'Creative design basics',
      icon: 'ps',
      rating: 8.9
    },
    {
      title: 'The Beginner\'s Guide to Color Theory for Digital Artists',
      subtitle: 'Visual design theory',
      icon: 'ct',
      rating: 7.8
    },
    {
      title: 'Design-Led Strategy: Design thinking for business strategy and startup',
      subtitle: 'Business design',
      icon: 'ds',
      rating: 5.4
    },
    {
      title: 'Introduction to iOS App Development with Swift 5',
      subtitle: 'Mobile development',
      icon: 'ios',
      rating: 3.5
    },
    {
      title: 'Web Design for Everybody: Basics of Web Development & Coding Specialization',
      subtitle: 'Frontend basics',
      icon: 'web',
      rating: 2.6
    },
    {
      title: 'Work Smarter Harder: Time Management for Personal & Professional Productivity',
      subtitle: 'Productivity',
      icon: 'tm',
      rating: 8.3
    },
    {
      title: 'Design strategy: design thinking for business strategy and entrepreneurship',
      subtitle: 'Entrepreneurship',
      icon: 'ux',
      rating: 7.5
    }
  ];

  readonly newsItems: NewsItem[] = [
    {
      title: 'Shift project kick from Part v2',
      category: 'Product Design',
      image: 'linear-gradient(135deg, #b7d8d1, #f7c96f)'
    },
    {
      title: 'Shift project kick from Part v2',
      category: 'Product Design',
      image: 'linear-gradient(135deg, #10213f, #d9765d)'
    },
    {
      title: 'Shift project kick from Part v2',
      category: 'Product Design',
      image: 'linear-gradient(135deg, #5d7d54, #f0bb4f)'
    },
    {
      title: 'Shift project kick from Part v2',
      category: 'Product Design',
      image: 'linear-gradient(135deg, #20262e, #ca8b57)'
    }
  ];

  myCourses: DashboardCourse[] = [
    {
      id: 'angular-21-complete-guide',
      title: 'Angular 21 Masterclass',
      description: 'Complete Angular development guide from beginner to advanced level.',
      image: 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif',
      progress: 75,
      rating: 4.8,
      lessons: 32,
      duration: '18h 45m',
      lastAccess: '2 days ago',
      buttonText: 'Resume Course',
      color: '#4F46E5'
    },
    {
      id: 'rxjs-deep-dive',
      title: 'RxJS Deep Dive',
      description: 'Master reactive programming with RxJS step by step.',
      image: 'https://rxjs.dev/assets/images/favicons/favicon-192x192.png',
      progress: 45,
      rating: 4.9,
      lessons: 18,
      duration: '12h 30m',
      lastAccess: '5 days ago',
      buttonText: 'Continue Learning',
      color: '#14B8A6'
    },
    {
      id: 'ngrx-complete-guide',
      title: 'NgRx Complete Guide',
      description: 'State management in Angular with NgRx.',
      image: 'https://ngrx.io/assets/images/badge.svg',
      progress: 90,
      rating: 4.7,
      lessons: 40,
      duration: '24h 15m',
      lastAccess: '1 day ago',
      buttonText: 'Resume Course',
      color: '#F97316'
    }
  ];

  goToCourse(course: PopularCourseCard): void {
    // If course details route exists use it; otherwise fallback to /student/course-details/:slug
    const slug = course.slug || course.id;
    this.router.navigate(['/student/course-details', slug]);
  }

  // existing demo method (kept for any existing template usage)
  continueCourse(course: DashboardCourse): void {
    this.router.navigate(['/student/my-courses', course.id, 'learn']);
  }
}

