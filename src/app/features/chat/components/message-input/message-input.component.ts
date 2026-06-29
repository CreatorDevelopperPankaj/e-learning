import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, MatIconModule, InputTextModule, ButtonModule],
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageInputComponent {
  @Output() readonly sendMessage = new EventEmitter<string>();
  @Output() readonly fileSelected = new EventEmitter<File>();
  @Output() readonly askTutor = new EventEmitter<string>();
  readonly draft = signal('');

  onSend(): void {
    if (!this.draft().trim()) return;
    this.sendMessage.emit(this.draft().trim());
    this.draft.set('');
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.fileSelected.emit(file);
    input.value = '';
  }
  onAskTutor(): void { if (this.draft().trim()) { this.askTutor.emit(this.draft().trim()); this.draft.set(''); } }
}

