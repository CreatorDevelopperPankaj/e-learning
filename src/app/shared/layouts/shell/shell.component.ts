import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicLayoutComponent } from '../public-layout/public-layout.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, PublicLayoutComponent],
  template: `
    <ng-container *ngIf="usePublicShell; else bare">
      <app-public-layout>
        <ng-content />
      </app-public-layout>
    </ng-container>

    <ng-template #bare>
      <ng-content />
    </ng-template>
  `
})
export class ShellComponent {
  @Input() usePublicShell = true;
}

