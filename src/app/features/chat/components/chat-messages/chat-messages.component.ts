import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ScrollPanelModule } from 'primeng/scrollpanel';

type PlaceholderMessage = { id: string; text: string };

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [CommonModule, MatIconModule, ScrollPanelModule],
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessagesComponent {
  readonly messages = signal<PlaceholderMessage[]>([
    { id: '1', text: 'Welcome to EduLearn Chat (placeholder).' },
    { id: '2', text: 'Messages will appear here after socket + REST integration.' }
  ]);
}

