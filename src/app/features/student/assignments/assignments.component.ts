import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-assignments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="assignments-page">
      <h1>Assignments</h1>
      <div class="assignment-grid">
        @for (assignment of assignments; track assignment.title) {
          <article class="assignment-card">
            <span>{{ assignment.course }}</span>
            <h2>{{ assignment.title }}</h2>
            <p>Due {{ assignment.due }}</p>
            <button type="button">Open Assignment</button>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .assignments-page { padding: 24px; }
    h1 { margin: 0 0 20px; font-size: 36px; color: #111827; }
    .assignment-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }
    .assignment-card {
      padding: 22px;
      border-radius: 22px;
      background: #fff;
      border: 1px solid #eef2f7;
    }
    .assignment-card span { color: #4f46e5; font-weight: 800; }
    .assignment-card h2 { margin: 14px 0 10px; }
    .assignment-card p { color: #64748b; }
    button {
      border: 0;
      border-radius: 12px;
      padding: 12px 16px;
      background: #d9ff43;
      font-weight: 800;
      cursor: pointer;
    }
    @media (max-width: 1000px) {
      .assignment-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class StudentAssignmentsComponent {
  readonly assignments = [
    { course: 'UX Fundamentals', title: 'Create a user journey map', due: 'tomorrow' },
    { course: 'Startup Finance', title: 'Build a simple forecast sheet', due: 'Friday' },
    { course: 'Angular 21', title: 'Create a reusable card component', due: 'next week' }
  ];
}
