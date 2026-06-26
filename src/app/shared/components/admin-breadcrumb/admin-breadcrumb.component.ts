import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: ``,
  styles: ``
})
export class AdminBreadcrumbComponent {
  @Input() title = 'Admin Dashboard';
}

