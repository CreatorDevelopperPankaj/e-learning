import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer'; // Use SidebarModule if on PrimeNG v17 or lower
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, DrawerModule, MenuModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() visible: boolean = false;
  @Input() items: MenuItem[] = []; // Pass menu items dynamically based on the layout/role
  @Output() visibleChange = new EventEmitter<boolean>();

  onClose() {
    this.visibleChange.emit(false);
  }
}