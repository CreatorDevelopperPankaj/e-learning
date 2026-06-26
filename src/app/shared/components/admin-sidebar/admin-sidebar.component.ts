import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent {
  @Input() collapsed = false;

  @Input() menuItems: MenuItem[] = [];

  // Track which group dropdowns are open (multiple open at once)
  private openGroups = new Set<string>();

  private getGroupKey(item: MenuItem, index: number): string {
    return (item.label ?? `group-${index}`) as string;
  }

  isGroupOpen(groupKey: string): boolean {
    // If sidebar is collapsed, keep dropdowns closed
    if (this.collapsed) return false;
    return this.openGroups.has(groupKey);
  }

  toggleGroup(item: MenuItem, index: number): void {
    if (this.collapsed) return;

    const key = this.getGroupKey(item, index);
    if (this.openGroups.has(key)) this.openGroups.delete(key);
    else this.openGroups.add(key);
  }

  toggleMenu(item: any) {
  item.expanded = !item.expanded;
}
}



