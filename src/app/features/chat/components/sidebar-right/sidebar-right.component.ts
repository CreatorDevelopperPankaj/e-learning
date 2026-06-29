import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ChatMessage } from '../../models/chat-message.model';
import { CourseMemberView } from '../../services/member.service';

@Component({
  selector: 'app-chat-sidebar-right',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarRightComponent {
  @Input({ required: false }) members: CourseMemberView[] = [];
  @Input() progressValue = 0;
  @Input() pinnedMessages: ChatMessage[] = [];
  @Input() sharedFiles: any[] = [];
  @Input() currentUserId = '';
  @Output() readonly memberSelected = new EventEmitter<CourseMemberView>();

  private readonly membersSig = signal<CourseMemberView[]>([]);

  ngOnChanges(): void {
    this.membersSig.set(this.members || []);
  }

  private normalizeRole(role: unknown): string {
    return String(role ?? '').trim().toLowerCase();
  }

  readonly instructors = computed(() =>
    (this.membersSig() || []).filter((m) => this.normalizeRole(m.role) === 'instructor')
  );

  readonly students = computed(() =>
    (this.membersSig() || []).filter((m) => this.normalizeRole(m.role) === 'student')
  );


  readonly studentsCount = computed(() => this.students().length);
  readonly instructorsCount = computed(() => this.instructors().length);

  initials(name: string) {
    return (name || 'User')
      .split(' ')
      .map((x) => x[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  fileName(file: any) {
    return file.name || file.fileName || 'Shared file';
  }
}

