import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-certificate-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="certificate-page">
      <a routerLink="/student/certificates" class="back-link">Back to Certificates</a>

      <div class="certificate-shell">
        <div class="certificate-preview">
          <span class="seal">EP</span>
          <p>Certificate of Completion</p>
          <h1>{{ title }}</h1>
          <strong>Issued to John Doe</strong>
          <small>Issued on 20 May 2025</small>
        </div>

        <aside class="certificate-actions">
          <h2>Certificate Actions</h2>
          <p>View, download, or share this certificate from your student dashboard.</p>

          <button type="button">Download PDF</button>
          <button type="button" class="secondary">Share Certificate</button>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .certificate-page { padding: 24px; }
    .back-link {
      color: #4f46e5;
      font-weight: 800;
      text-decoration: none;
    }
    .certificate-shell {
      display: grid;
      grid-template-columns: 1.6fr 0.8fr;
      gap: 20px;
      margin-top: 18px;
    }
    .certificate-preview {
      min-height: 500px;
      padding: 42px;
      border: 12px solid #d9ff43;
      border-radius: 28px;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-shadow: 0 18px 48px rgba(15, 23, 42, .08);
    }
    .seal {
      width: 84px;
      height: 84px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #4f46e5;
      color: #fff;
      font-size: 24px;
      font-weight: 900;
    }
    .certificate-preview p {
      margin: 24px 0 8px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: .08em;
      font-weight: 800;
    }
    .certificate-preview h1 {
      margin: 0 0 20px;
      font-size: 44px;
      color: #111827;
    }
    .certificate-preview strong { font-size: 20px; }
    .certificate-preview small { margin-top: 10px; color: #64748b; }
    .certificate-actions {
      padding: 24px;
      border-radius: 24px;
      background: #111827;
      color: #fff;
      align-self: start;
    }
    .certificate-actions h2 { margin: 0 0 10px; }
    .certificate-actions p { color: #cbd5e1; }
    button {
      width: 100%;
      border: 0;
      border-radius: 14px;
      padding: 14px 18px;
      margin-top: 12px;
      background: #d9ff43;
      color: #111827;
      font-weight: 900;
      cursor: pointer;
    }
    button.secondary {
      background: #293244;
      color: #fff;
    }
    @media (max-width: 900px) {
      .certificate-shell { grid-template-columns: 1fr; }
      .certificate-preview h1 { font-size: 32px; }
    }
  `]
})
export class StudentCertificateDetailsComponent {
  private readonly route = inject(ActivatedRoute);

  readonly title = (this.route.snapshot.paramMap.get('certificateId') || 'certificate')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
