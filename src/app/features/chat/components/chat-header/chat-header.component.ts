import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, ButtonModule],
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatHeaderComponent {
  readonly headerText = computed(() => 'Channel Header (placeholder)');
}

