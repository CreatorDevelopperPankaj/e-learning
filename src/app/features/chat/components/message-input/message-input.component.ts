import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, MatIconModule, MenuModule],
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageInputComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('videoInput') videoInputRef!: ElementRef<HTMLInputElement>;

  @Output() readonly sendMessage = new EventEmitter<string>();
  @Output() readonly fileSelected = new EventEmitter<File>();
  @Output() readonly askTutor = new EventEmitter<string>();

  readonly draft = signal('');

  addMenuItems: MenuItem[] = [
    { label: 'Attach File', icon: 'pi pi-paperclip', command: () => this.fileInputRef.nativeElement.click() },
    { label: 'Image', icon: 'pi pi-image', command: () => this.imageInputRef.nativeElement.click() },
    { label: 'Video', icon: 'pi pi-video', command: () => this.videoInputRef.nativeElement.click() },
    { separator: true },
    { label: 'AI Tutor', icon: 'pi pi-sparkles', command: () => this.onAskTutor() }
  ];

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

  onAskTutor(): void {
    if (this.draft().trim()) {
      this.askTutor.emit(this.draft().trim());
      this.draft.set('');
    }
  }
}