import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-course-player',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="player-page">
      <div class="player-header">
        <div>
          <h1>{{ courseTitle }}</h1>
          <p>Continue learning from your last watched lesson.</p>
        </div>

        <button type="button" class="complete-btn">Mark Lesson Complete</button>
      </div>

      <div class="player-grid">
        <div class="video-panel">
          <div class="play-button">
            <i class="pi pi-play"></i>
          </div>
          <span>Lesson video preview</span>
        </div>

        <aside class="lesson-panel">
          <h2>Course Lessons</h2>

          @for (lesson of lessons; track lesson.title; let index = $index) {
            <button type="button" class="lesson-item" [class.active]="index === 0">
              <span>{{ index + 1 }}</span>
              <div>
                <strong>{{ lesson.title }}</strong>
                <small>{{ lesson.duration }}</small>
              </div>
            </button>
          }
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .player-page { padding: 24px; }
    .player-header {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 22px;
    }
    .back-link {
      color: #4f46e5;
      font-weight: 700;
      text-decoration: none;
    }
    h1 { margin: 10px 0 6px; font-size: 34px; color: #111827; }
    p { margin: 0; color: #64748b; }
    .complete-btn {
      align-self: center;
      border: 0;
      border-radius: 14px;
      padding: 14px 18px;
      background: #d9ff43;
      font-weight: 800;
      cursor: pointer;
    }
    .player-grid {
      display: grid;
      grid-template-columns: 1.7fr 0.8fr;
      gap: 20px;
    }
    .video-panel {
      min-height: 520px;
      border-radius: 26px;
      background: linear-gradient(135deg, #101827, #4f46e5);
      color: #fff;
      display: grid;
      place-items: center;
      text-align: center;
    }
    .play-button {
      width: 88px;
      height: 88px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: rgba(255,255,255,.18);
      font-size: 30px;
      margin-bottom: 14px;
    }
    .lesson-panel {
      background: #fff;
      border: 1px solid #eef2f7;
      border-radius: 24px;
      padding: 20px;
    }
    .lesson-panel h2 { margin: 0 0 16px; }
    .lesson-item {
      width: 100%;
      border: 0;
      background: transparent;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      border-radius: 16px;
      cursor: pointer;
      text-align: left;
    }
    .lesson-item:hover,
    .lesson-item.active { background: #eef2ff; }
    .lesson-item > span {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      border-radius: 10px;
      background: #4f46e5;
      color: #fff;
      font-weight: 800;
    }
    .lesson-item div { display: flex; flex-direction: column; }
    .lesson-item small { color: #64748b; margin-top: 3px; }
    @media (max-width: 1000px) {
      .player-grid { grid-template-columns: 1fr; }
      .player-header { flex-direction: column; }
      .complete-btn { align-self: flex-start; }
    }
  `]
})
export class StudentCoursePlayerComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly courseId = this.route.snapshot.paramMap.get('courseId') || 'course';

  readonly courseTitle = this.courseId
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  readonly lessons = [
    { title: 'Introduction and course roadmap', duration: '20 min' },
    { title: 'Core concepts with examples', duration: '28 min' },
    { title: 'Hands-on practice task', duration: '35 min' },
    { title: 'Quiz and recap', duration: '12 min' }
  ];

}
