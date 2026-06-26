import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef,
  inject, output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-token-expiry-warning',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-dialog
      [visible]="true"
      [modal]="true"
      [closable]="false"
      [draggable]="false"
      [resizable]="false"
      styleClass="token-expiry-dialog"
    >
      <ng-template pTemplate="header">
        <div class="dialog-header">
          <i class="pi pi-clock warning-icon"></i>
          <span>Session Expiring Soon</span>
        </div>
      </ng-template>

      <div class="dialog-body">
        <p class="message">Your session is about to expire in</p>

        <div class="countdown-wrapper">
          <div class="countdown" [class.danger]="secondsLeft <= 30">
            {{ secondsLeft }}
          </div>
          <span class="seconds-label">seconds</span>
        </div>

        <!-- ✅ Timer 0 hone pe message change ho jata hai -->
        @if (secondsLeft > 0) {
          <p class="sub-message">Do you want to continue your session or logout?</p>
        } @else {
          <p class="sub-message expired-message">
            <i class="pi pi-exclamation-triangle"></i>
            Session expired. Please choose an action.
          </p>
        }
      </div>

      <ng-template pTemplate="footer">
        <button
          pButton
          label="Logout"
          icon="pi pi-sign-out"
          class="p-button-danger p-button-outlined"
          (click)="onLogout.emit()"
        ></button>

        <button
          pButton
          label="Continue Session"
          icon="pi pi-refresh"
          class="p-button-success"
          (click)="onContinue.emit()"
        ></button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep {
      .token-expiry-dialog {
        .p-dialog { width: 420px; }

        .p-dialog-header {
          border-bottom: 1px solid var(--surface-border);
          padding: 1.25rem 1.5rem;
        }

        .p-dialog-footer {
          border-top: 1px solid var(--surface-border);
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
      }
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 0.625rem;

      .warning-icon {
        font-size: 1.25rem;
        color: var(--yellow-500);
      }

      span {
        font-size: 1.1rem;
        font-weight: 600;
      }
    }

    .dialog-body {
      text-align: center;
      padding: 1.5rem 1rem;

      .message {
        color: var(--text-color-secondary);
        margin: 0 0 1rem;
      }

      .sub-message {
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        margin: 1rem 0 0;
      }

      /* ✅ Timer 0 pe red warning message */
      .expired-message {
        color: var(--red-500);
        font-weight: 600;

        i { margin-right: 0.375rem; }
      }
    }

    .countdown-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;

      .countdown {
        font-size: 3.5rem;
        font-weight: 700;
        color: var(--orange-500);
        line-height: 1;
        font-variant-numeric: tabular-nums;
        transition: color 0.3s ease;

        /* 30s se kam → orange to red */
        &.danger { color: var(--red-500); }
      }

      .seconds-label {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  `]
})
export class TokenExpiryWarningComponent implements OnInit, OnDestroy {
  onContinue = output<void>();
  onLogout   = output<void>();

  secondsLeft = 60;

  private cdr        = inject(ChangeDetectorRef);
  private intervalId!: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.secondsLeft--;
      this.cdr.markForCheck();

      // ✅ 0 pe sirf interval stop — koi action nahi
      // Popup freeze ho jata hai jab tak user click na kare
      if (this.secondsLeft <= 0) {
        this.secondsLeft = 0; // negative se bachao
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}