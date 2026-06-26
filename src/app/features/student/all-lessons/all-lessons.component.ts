import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-all-lessons',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="lessons-page">
      <div class="page-header">
        <div>
          <h1>All Upcoming Lessons</h1>
          <p>Open any lesson to continue learning from that point.</p>
        </div>
      </div>

      <div class="lesson-list">
        @for (lesson of lessons; track lesson.title) {
          <article class="lesson-card" [routerLink]="['/student/my-courses', lesson.courseId, 'learn']">
            <span class="lesson-icon"><i class="pi pi-play"></i></span>

            <div>
              <strong>{{ lesson.title }}</strong>
              <p>{{ lesson.subtitle }}</p>
            </div>

            <span class="teacher">{{ lesson.teacher }}</span>
            <span class="duration">{{ lesson.duration }}</span>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .lessons-page { padding: 24px; }
    .page-header {
      margin-bottom: 22px;
    }
    a { color: #4f46e5; font-weight: 700; text-decoration: none; }
    h1 { margin: 10px 0 6px; font-size: 36px; color: #111827; }
    p { margin: 0; color: #64748b; }
    .lesson-list {
      display: grid;
      gap: 14px;
    }
    .lesson-card {
      display: grid;
      grid-template-columns: 52px 1fr 180px 90px;
      align-items: center;
      gap: 16px;
      padding: 18px;
      background: #fff;
      border: 1px solid #eef2f7;
      border-radius: 18px;
      cursor: pointer;
      transition: 0.2s;
    }
    .lesson-card:hover {
      transform: translateY(-2px);
      border-color: #c7d2fe;
      box-shadow: 0 14px 34px rgba(79,70,229,.12);
    }
    .lesson-icon {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: #eef2ff;
      color: #4f46e5;
    }
    strong { color: #111827; }
    .teacher,
    .duration { font-weight: 700; color: #111827; }
    @media (max-width: 850px) {
      .lesson-card { grid-template-columns: 52px 1fr; }
      .teacher,
      .duration { grid-column: 2; }
    }
  `]
})
export class StudentAllLessonsComponent {
  readonly lessons = [
    {
      courseId: 'ux-fundamentals',
      title: 'Introduction to UX Principles',
      subtitle: 'Foundations of user-centered design',
      teacher: 'Alex Chen',
      duration: '20 min'
    },
    {
      courseId: 'ui-design-masterclass',
      title: 'Color Theory in Digital Design',
      subtitle: 'Understanding palettes and contrasts',
      teacher: 'Mia Roberts',
      duration: '25 min'
    },
    {
      courseId: 'startup-finance-essentials',
      title: 'Basics of Financial Forecasting',
      subtitle: 'Planning budgets with real data',
      teacher: 'Priya Kapoor',
      duration: '22 min'
    },
    {
      courseId: 'digital-marketing-strategy',
      title: 'Building a Pitch Deck',
      subtitle: 'Creating presentations that win investors',
      teacher: 'Samuel Wright',
      duration: '28 min'
    }
  ];
}
