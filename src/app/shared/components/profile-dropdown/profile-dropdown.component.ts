import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  profileImage?: string;
  profileImageFileName?: string;
  profileImageFilePath?: string;
  profileImageFullUrl?: string;
  role?: string;
  roleId?: number;
  bio?: string;
  country?: string;
  city?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  instructorStatus?: string;
}

// type UserRole = 'student' | 'instructor' | 'admin';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
})
export class ProfileDropdownComponent {
  userProfileDetails: UserProfile | null = null;
  @Input() name = '';
  @Input() email = '';
  // @Input() role: string = 'student';

  @Input() initials = '';
  @Input() notificationCount = 3;

  @Input() showDashboardAction = false;
  @Input() publicMenuOnly = false;

  isOpen = false;
  darkTheme = false;

  private readonly THEME_KEY = 'appTheme';
  private readonly DARK_CLASS = 'app-dark-theme';

  private storedUserName = '';
  private storedUserEmail = '';
  private storedUserInitials = '';

  private sub = new Subscription();

  constructor(
    private router: Router,
    private host: ElementRef<HTMLElement>,
    private authService: AuthService
  ) {
    // initial
    const u = this.authService.currentUser;
    this.patchFromUser(u);

    const storedTheme = localStorage.getItem(this.THEME_KEY);
    const isDark = storedTheme === 'dark';
    this.darkTheme = isDark;
    document.body.classList.toggle(this.DARK_CLASS, isDark);

    // live updates (login ke baad)
    this.sub.add(
      this.authService.currentUser$.subscribe((user) => {
        console.log('ProfileDropdownComponent: got user update', user);
        this.userProfileDetails = user;
        console.log('ProfileDropdownComponent: updated userProfileDetails', this.userProfileDetails);
         this.patchFromUser(user)
         })
    );
  }

  private patchFromUser(u: any): void {
    const name = u?.name ?? '';
    const email = u?.email ?? '';
    this.storedUserName = name;
    this.storedUserEmail = email;
    this.storedUserInitials = this.computeInitials(this.storedUserName);
  }



  // get roleLabel(): string {
  //   const r = (this.role) as string;
  //   return r.charAt(0).toUpperCase() + r.slice(1);
  // }

  get resolvedName(): string {
    return this.name || this.storedUserName;
  }

  get resolvedEmail(): string {
    return this.email || this.storedUserEmail;
  }

  get resolvedInitials(): string {
    return this.initials || this.storedUserInitials;
  }

  private computeInitials(name: string): string {
    const n = name?.trim();
    if (!n) return '';
    return n
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  }


  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  goTo(
    path:
      | 'dashboard'
      | 'profile'
      | 'settings'
      | 'notifications'
      | 'admin'
      | 'instructor'
      | 'student'
  ): void {
    this.isOpen = false;

    if (path === 'admin') {
      this.router.navigate(['/admin/login']);
      return;
    }

    if (path === 'instructor') {
      this.router.navigate(['/instructor/login']);
      return;
    }

    if (path === 'student') {
      this.router.navigate(['/login']);
      return;
    }
    // Prefer role from JWT/user object. For admin dropdown, route must go to `/admin/profile`.
    const role = this.userProfileDetails?.role?.toLowerCase();
    if (role === 'admin' || this.userProfileDetails?.roleId === 3) {
      this.router.navigate([`/admin/${path}`]);
      return;
    }

    if (role === 'instructor' || this.userProfileDetails?.roleId === 2) {
      this.router.navigate([`/instructor/${path}`]);
      return;
    }

    // student default
    this.router.navigate([`/student/${path}`]);
  }

  toggleTheme(event: MouseEvent): void {
    event.stopPropagation();
    this.darkTheme = !this.darkTheme;
    localStorage.setItem(this.THEME_KEY, this.darkTheme ? 'dark' : 'light');
    document.body.classList.toggle(this.DARK_CLASS, this.darkTheme);
  }

logout(): void {
  this.isOpen = false;

  const role = this.userProfileDetails?.role?.toLowerCase();
  const roleId = this.userProfileDetails?.roleId;

  this.authService.logout();

  if (role === 'admin' || roleId === 3) {
    this.router.navigate(['/admin/login']);
    return;
  }

  if (role === 'instructor' || roleId === 2) {
    this.router.navigate(['/instructor/login']);
    return;
  }

  this.router.navigate(['/login']);
}

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.isOpen = false;
  }
}