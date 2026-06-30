import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ChatMessage } from '../../models/chat-message.model';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [CommonModule, MatIconModule, MenuModule],
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessagesComponent {
  @Input() messages: ChatMessage[] = [];
  @Input() currentUserId = '';
  @Input() loading = false;

  @Output() readonly react = new EventEmitter<{ message: ChatMessage; emoji: string }>();
  @Output() readonly pin = new EventEmitter<ChatMessage>();
  @Output() readonly reply = new EventEmitter<ChatMessage>();
  @Output() readonly copy = new EventEmitter<ChatMessage>();
  @Output() readonly edit = new EventEmitter<ChatMessage>();
  @Output() readonly remove = new EventEmitter<ChatMessage>();
  @Output() readonly report = new EventEmitter<ChatMessage>();

  private activeMessage: ChatMessage | null = null;
  moreMenuItems: MenuItem[] = [];

  id(message: ChatMessage): string {
    return message._id || message.id || '';
  }

  initials(name: string): string {
    return (name || 'User').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
  }

  openMoreMenu(event: Event, message: ChatMessage, menu: any): void {
    this.activeMessage = message;
    const isOwn = message.senderId === this.currentUserId;

    this.moreMenuItems = [
      { label: 'Reply', icon: 'pi pi-reply', command: () => this.reply.emit(this.activeMessage!) },
      { label: 'Copy Text', icon: 'pi pi-copy', command: () => this.handleCopy(this.activeMessage!) },
      ...(isOwn
        ? [
            { label: 'Edit', icon: 'pi pi-pencil', command: () => this.edit.emit(this.activeMessage!) },
            { separator: true },
            { label: 'Delete', icon: 'pi pi-trash', styleClass: 'danger-item', command: () => this.remove.emit(this.activeMessage!) }
          ]
        : [
            { separator: true },
            { label: 'Report', icon: 'pi pi-flag', styleClass: 'danger-item', command: () => this.report.emit(this.activeMessage!) }
          ])
    ];

    menu.toggle(event);
  }

  private handleCopy(message: ChatMessage): void {
    navigator.clipboard?.writeText(message.text || '');
    this.copy.emit(message);
  }
}