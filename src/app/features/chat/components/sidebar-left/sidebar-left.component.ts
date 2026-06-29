import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Channel } from '../../models/channel.model';
import { ChatCourse } from '../../services/chat-course.service';

@Component({ selector: 'app-chat-sidebar-left', standalone: true, imports: [CommonModule, MatIconModule], templateUrl: './sidebar-left.component.html', styleUrls: ['./sidebar-left.component.scss'], changeDetection: ChangeDetectionStrategy.OnPush })
export class SidebarLeftComponent {
  @Input() courseId: string | null = null;
  @Input() channelId: string | null = null;
  @Input() apiChannels: Channel[] = [];
  @Input() apiCourses: ChatCourse[] = [];
  @Input() canAddCourse = false;
  @Output() readonly channelSelected = new EventEmitter<Channel>();
  @Output() readonly courseSelected = new EventEmitter<ChatCourse>();
  @Output() readonly addCourse = new EventEmitter<void>();
  readonly courses = [
    { icon: 'A', color: '#e9294f', name: 'Angular Advanced', batch: 'Batch A', progress: 78 },
    { icon: '⚛', color: '#11bde7', name: 'React Development', batch: 'Batch B', progress: 65 },
    { icon: 'TS', color: '#2376bb', name: 'TypeScript Mastery', batch: 'Batch A', progress: 82 },
    { icon: 'N', color: '#65ad34', name: 'Node.js Backend', batch: 'Batch C', progress: 45 },
    { icon: '5', color: '#f04b27', name: 'HTML & CSS', batch: 'Batch D', progress: 90 }
  ];
  readonly channels = [
    { icon: 'campaign', name: 'Announcements', count: 0 }, { icon: 'chat_bubble_outline', name: 'General Chat', count: 8, active: true },
    { icon: 'help_outline', name: 'Doubts & Help', count: 3 }, { icon: 'school', name: 'Study Material', count: 0 },
    { icon: 'assignment', name: 'Assignments', count: 0 }, { icon: 'videocam', name: 'Live Classes', count: 0 },
    { icon: 'insert_chart_outlined', name: 'Course Progress', count: 0 }
  ];
  channelKey(channel: Channel): string { return channel._id || channel.id || ''; }
  courseKey(course: ChatCourse): string { return course._id || course.id || ''; }
  courseInitial(course: ChatCourse): string { return course.title.slice(0, 2).toUpperCase(); }
}
