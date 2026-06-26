import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-chat-sidebar-left',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarLeftComponent {
  @Input() courseId: string | null = null;
  @Input() channelId: string | null = null;

  readonly placeholderTitle = computed(() => {
    return this.courseId ? `Courses • ${this.courseId}` : 'Courses';
  });

  readonly isCollapsed = computed(() => false);
}

