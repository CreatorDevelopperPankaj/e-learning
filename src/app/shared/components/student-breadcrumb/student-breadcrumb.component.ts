import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';

interface BreadcrumbStep {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-student-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-breadcrumb.component.html',
  styleUrls: ['./student-breadcrumb.component.scss']
})
export class StudentBreadcrumbComponent implements OnInit, OnDestroy {
  steps: BreadcrumbStep[] = [];

  private readonly routeLabels: Record<string, string> = {
    'my-courses': 'My Courses',
    lessons: 'Lessons',
    learn: 'Learning',
    details: 'Course Details',
    learning: 'Learning',
    certificates: 'Certificates',
    assignments: 'Assignments',
    messages: 'Messages',
    wishlist: 'Wishlist',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications'
  };

  private readonly routeLinks: Record<string, string> = {
    dashboard: '/student/dashboard',
    'my-courses': '/student/my-courses',
    lessons: '/student/my-courses/lessons',
    learning: '/student/learning',
    certificates: '/student/certificates',
    assignments: '/student/assignments',
    messages: '/student/messages',
    wishlist: '/student/wishlist',
    profile: '/student/profile',
    settings: '/student/settings',
    notifications: '/student/notifications'
  };

  private sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.buildSteps(this.router.url);

    this.sub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.buildSteps(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  isCompleted(index: number): boolean {
    return index < this.steps.length - 1;
  }

  isActive(index: number): boolean {
    return index === this.steps.length - 1;
  }

  getIcon(label: string): string {
    const iconMap: Record<string, string> = {
      Home: 'pi pi-home',
      Profile: 'pi pi-user',
      'My Courses': 'pi pi-book',
      Projects: 'pi pi-briefcase',
      Learning: 'pi pi-play-circle',
      Lessons: 'pi pi-list',
      'Course Details': 'pi pi-info-circle',
      Certificates: 'pi pi-verified',
      Assignments: 'pi pi-file',
      Messages: 'pi pi-comments',
      Wishlist: 'pi pi-heart',
      Settings: 'pi pi-cog',
      Notifications: 'pi pi-bell'
    };

    return iconMap[label] || 'pi pi-table';
  }

  private buildSteps(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const segments = cleanUrl.split('/').filter(Boolean);
    const studentIndex = segments.indexOf('student');
    const studentSegments = studentIndex >= 0 ? segments.slice(studentIndex + 1) : [];

    const steps: BreadcrumbStep[] = [
      { label: 'Home', route: '/student/dashboard' }
    ];

    if (!studentSegments.length || studentSegments[0] === 'dashboard') {
      this.steps = steps;
      return;
    }

    const firstSegment = studentSegments[0];
    steps.push({
      label: this.getLabel(firstSegment),
      route: this.routeLinks[firstSegment]
    });

    if (firstSegment === 'my-courses') {
      this.addMyCoursesDetailSteps(steps, studentSegments);
    } else if (firstSegment === 'certificates' && studentSegments[1]) {
      steps.push({
        label: this.slugToLabel(studentSegments[1])
      });
    }

    this.steps = steps;
  }

  private addMyCoursesDetailSteps(steps: BreadcrumbStep[], segments: string[]): void {
    if (segments[1] === 'lessons') {
      steps.push({
        label: 'Lessons',
        route: this.routeLinks['lessons']
      });
      return;
    }

    if (!segments[1]) {
      return;
    }

    steps.push({
      label: this.slugToLabel(segments[1]),
      route: `/student/my-courses/${segments[1]}/details`
    });

    if (segments[2]) {
      steps.push({
        label: this.getLabel(segments[2])
      });
    }
  }

  private getLabel(segment: string): string {
    return this.routeLabels[segment] || this.slugToLabel(segment);
  }

  private slugToLabel(slug: string): string {
    return slug
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
