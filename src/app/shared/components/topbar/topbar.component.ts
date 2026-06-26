import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ProfileDropdownComponent } from '../profile-dropdown/profile-dropdown.component';


@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ProfileDropdownComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Input() title = 'Dashboard';

  @Input() userName = '';
  @Input() userEmail = '';
  @Input() userInitials = '';

  @Input() notificationCount = 3;

  @Output()
  menuClick = new EventEmitter<void>();
}

