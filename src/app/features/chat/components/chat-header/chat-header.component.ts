import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'app-chat-header',
    standalone: true,
    imports: [CommonModule, MatIconModule, MenuModule],
    templateUrl: './chat-header.component.html',
    styleUrls: ['./chat-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatHeaderComponent {
    @Input() title = 'Announcements';
    @Input() studentsCount = 0;
    @Input() instructorsCount = 0;
    @Input() notificationCount = 0;
    @Input() userName = 'John Smith';
    @Input() userRole = 'Instructor';
    @Input() initials = 'JS';

    @Output() readonly searchMessages = new EventEmitter<string>();
    // @Output() readonly toggleSidebar = new EventEmitter<void>();

    menuItems: MenuItem[] = [
        { label: 'View Participants', icon: 'pi pi-users' },
        { label: 'Course Details', icon: 'pi pi-book' },
        { label: 'Shared Files', icon: 'pi pi-folder' },
        { separator: true },
        { label: 'Search Messages', icon: 'pi pi-search' },
        { label: 'Pin Chat', icon: 'pi pi-thumbtack' },
        { label: 'Mute Notifications', icon: 'pi pi-bell-slash' },
        { separator: true },
        { label: 'AI Tutor', icon: 'pi pi-sparkles', badge: 'New' },
        { label: 'Summarize Chat', icon: 'pi pi-file' },
        { separator: true },
        { label: 'Clear Chat', icon: 'pi pi-trash', styleClass: 'danger-item' },
        { label: 'Leave Course', icon: 'pi pi-sign-out', styleClass: 'leave-item' }
    ];
}