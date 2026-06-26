import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export type NotificationSeverity = 'success' | 'info' | 'warn' | 'error';

export interface NotificationOptions {
  summary?: string;
  detail: string;
  life?: number;
  sticky?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private readonly messageService: MessageService) {}

  success(detail: string, summary = 'Success'): void {
    this.show({ severity: 'success', summary, detail, life: 3500 });
  }

  info(detail: string, summary = 'Info'): void {
    this.show({ severity: 'info', summary, detail, life: 3500 });
  }

  warning(detail: string, summary = 'Warning'): void {
    this.show({ severity: 'warn', summary, detail, life: 4500 });
  }

  error(detail: string, summary = 'Error'): void {
    this.show({ severity: 'error', summary, detail, life: 6000 });
  }

  clear(): void {
    this.messageService.clear();
  }

  private show(options: NotificationOptions & { severity: NotificationSeverity }): void {
    this.messageService.add({
      severity: options.severity,
      summary: options.summary,
      detail: options.detail,
      life: options.life,
      sticky: options.sticky
    });
  }
}
