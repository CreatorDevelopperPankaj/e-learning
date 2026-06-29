import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-chat-header',
    standalone: true, imports: [CommonModule, MatIconModule],
    templateUrl: './chat-header.component.html',
    styleUrls: ['./chat-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatHeaderComponent {
    @Input() title = 'Angular Advanced Development';
    @Input() studentsCount = 0;
    @Input() instructorsCount = 0;

    @Output() readonly searchMessages = new EventEmitter<string>();
}

