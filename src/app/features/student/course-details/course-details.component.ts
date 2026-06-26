import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-course-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="details-page">

      <div class="details-card">
        <span class="tag">Design</span>
        <h1>{{ title }}</h1>
        <p>
          Learn a structured workflow, practical examples, project tasks and
          mentor-led lessons for this course.
        </p>

        <div class="stats">
          <span><strong>24</strong> lessons</span>
          <span><strong>8h 40m</strong> duration</span>
          <span><strong>1,200+</strong> students</span>
        </div>

        <div class="actions">
          <a class="primary-action" [routerLink]="['/student/my-courses', courseId, 'learn']">
            Continue Course
          </a>
          <a class="secondary-action" routerLink="/student/my-courses/lessons">
            View Lessons
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .details-page { padding: 24px; }
    .back-link {
      color: #4f46e5;
      font-weight: 700;
      text-decoration: none;
    }
    .details-card {
      margin-top: 18px;
      min-height: 460px;
      padding: 34px;
      border-radius: 28px;
      color: #111827;
      background: linear-gradient(135deg, #d9ff43, #f8ffb3);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .tag {
      width: fit-content;
      padding: 8px 14px;
      border-radius: 999px;
      background: #111;
      color: #fff;
      font-weight: 800;
    }
    h1 {
      max-width: 760px;
      margin: 26px 0 14px;
      font-size: 52px;
      line-height: 1.05;
    }
    p {
      max-width: 620px;
      margin: 0;
      color: #334155;
      font-size: 18px;
    }
    .stats {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin: 28px 0;
    }
    .stats span {
      padding: 12px 16px;
      border-radius: 16px;
      background: rgba(255,255,255,.65);
    }
    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .primary-action,
    .secondary-action {
      padding: 14px 18px;
      border-radius: 14px;
      font-weight: 800;
      text-decoration: none;
    }
    .primary-action {
      background: #ff5a36;
      color: #fff;
    }
    .secondary-action {
      background: #111827;
      color: #fff;
    }
    @media (max-width: 768px) {
      h1 { font-size: 36px; }
      .details-card { padding: 24px; }
    }
  `]
})
export class StudentCourseDetailsComponent {
  private readonly route = inject(ActivatedRoute);

  readonly courseId = this.route.snapshot.paramMap.get('courseId') || 'advanced-typography';

  readonly title = this.courseId
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
