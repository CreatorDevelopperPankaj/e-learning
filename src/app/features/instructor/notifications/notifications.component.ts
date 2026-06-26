import { Component } from '@angular/core';

@Component({
  selector: 'app-instructor-notifications',
  standalone: true,
  template: `
    <section class="page-panel">
      <h2>Instructor Notifications</h2>
      <p>Student activity, course updates and account alerts will appear here.</p>
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
export class InstructorNotificationsComponent {}
