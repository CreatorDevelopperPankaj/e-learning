import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-sidebar-right',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarRightComponent {
  private readonly _title = signal('Resources & Members');

  readonly header = computed(() => this._title());
}

