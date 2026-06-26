import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { SidebarLeftComponent } from '../components/sidebar-left/sidebar-left.component';
import { ChatHeaderComponent } from '../components/chat-header/chat-header.component';
import { ChatMessagesComponent } from '../components/chat-messages/chat-messages.component';
import { MessageInputComponent } from '../components/message-input/message-input.component';
import { SidebarRightComponent } from '../components/sidebar-right/sidebar-right.component';





@Component({
  selector: 'app-chat-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarLeftComponent,
    ChatHeaderComponent,
    ChatMessagesComponent,
    MessageInputComponent,
    SidebarRightComponent
  ],
  templateUrl: './chat-shell.component.html',
  styleUrls: ['./chat-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatShellComponent {
  private readonly route = inject(ActivatedRoute);

  readonly courseId = signal<string | null>(null);
  readonly channelId = signal<string | null>(null);

  readonly isMobile = signal(false);

  readonly title = computed(() => {
    const courseId = this.courseId();
    const channelId = this.channelId();
    if (!courseId) return 'Chat';
    return channelId ? `Chat • ${courseId}` : `Chat • ${courseId}`;
  });

  constructor() {
    // Snapshot-based placeholder. Replace with reactive params if needed.
    this.courseId.set(this.route.snapshot.paramMap.get('courseId'));
    this.channelId.set(this.route.snapshot.paramMap.get('channelId'));

    // Responsive placeholder.
    const update = () => this.isMobile.set(window.matchMedia('(max-width: 960px)').matches);
    update();

    // No teardown needed for foundation-phase placeholders.
    window.addEventListener('resize', update);
    effect(() => {
      // Reference signals for template updates.
      this.courseId();
      this.channelId();
      this.isMobile();
    });
  }
}

