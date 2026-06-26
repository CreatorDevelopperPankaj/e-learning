import { Component } from '@angular/core';

@Component({
  selector: 'app-student-notifications',
  standalone: true,
  template: `
    <section class="page-panel">
      <h2>Student Notifications</h2>
      <p>Your course updates, reminders and alerts will appear here.</p>
    </section>
  `,
  styles: [`
    .page-panel {
      padding: 24px;
      background: #fff;
      border-radius: 12px;
    }
  `]
})
export class StudentNotificationsComponent {}
