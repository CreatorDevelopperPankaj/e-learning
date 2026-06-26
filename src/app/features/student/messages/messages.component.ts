import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-messages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="messages-page">
      <h1>Messages</h1>
      <div class="message-list">
        @for (message of messages; track message.name) {
          <article class="message-card">
            <span class="avatar">{{ message.initials }}</span>
            <div>
              <h2>{{ message.name }}</h2>
              <p>{{ message.preview }}</p>
            </div>
            <small>{{ message.time }}</small>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .messages-page { padding: 24px; }
    h1 { margin: 0 0 20px; font-size: 36px; color: #111827; }
    .message-list { display: grid; gap: 14px; }
    .message-card {
      display: grid;
      grid-template-columns: 52px 1fr 90px;
      align-items: center;
      gap: 14px;
      padding: 18px;
      border-radius: 18px;
      background: #fff;
      border: 1px solid #eef2f7;
    }
    .avatar {
      width: 46px;
      height: 46px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: #4f46e5;
      color: #fff;
      font-weight: 800;
    }
    h2 { margin: 0 0 5px; font-size: 18px; }
    p { margin: 0; color: #64748b; }
    small { color: #64748b; font-weight: 700; }
    @media (max-width: 700px) {
      .message-card { grid-template-columns: 52px 1fr; }
      small { grid-column: 2; }
    }
  `]
})
export class StudentMessagesComponent {
  readonly messages = [
    { initials: 'AC', name: 'Alex Chen', preview: 'Your UX assignment feedback is ready.', time: '10 min' },
    { initials: 'MR', name: 'Mia Roberts', preview: 'Join the live design review today.', time: '1 hr' },
    { initials: 'PK', name: 'Priya Kapoor', preview: 'Finance lesson notes have been uploaded.', time: '2 hrs' }
  ];
}
