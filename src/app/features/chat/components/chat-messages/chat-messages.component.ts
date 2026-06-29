import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChatMessage } from '../../models/chat-message.model';

@Component({ selector:'app-chat-messages', standalone:true, imports:[CommonModule,MatIconModule], templateUrl:'./chat-messages.component.html', styleUrls:['./chat-messages.component.scss'], changeDetection:ChangeDetectionStrategy.OnPush })
export class ChatMessagesComponent {
  @Input() messages: ChatMessage[] = [];
  @Input() currentUserId = '';
  @Input() loading = false;
  @Output() readonly react = new EventEmitter<{message:ChatMessage;emoji:string}>();
  @Output() readonly pin = new EventEmitter<ChatMessage>();
  id(message:ChatMessage):string { return message._id || message.id || ''; }
  initials(name:string):string { return (name || 'User').split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase(); }
}
