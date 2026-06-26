import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ProfileDropdownComponent } from '../../components/profile-dropdown/profile-dropdown.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserModel } from '../../../core/models/user.model';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    DrawerModule,
    MenuModule,
    ProfileDropdownComponent
  ],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  mobileSidebarVisible = false;
  navItems: MenuItem[] = [];
  currentUser: UserModel | null = null;

  showShell = true;

  showLoginMenu = false;


  private readonly sub = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateShellVisibility();

    this.sub.add(this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    }));

    this.sub.add(this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.updateShellVisibility();
      }));

    this.navItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => this.navigateAndScroll('home')
      },
      {
        label: 'About',
        icon: 'pi pi-info-circle',
        command: () => this.navigateAndScroll('about')
      },
      {
        label: 'Pricing',
        icon: 'pi pi-money-bill',
        command: () => this.navigateAndScroll('pricing')
      },
      {
        label: 'FAQ',
        icon: 'pi pi-question-circle',
        command: () => this.navigateAndScroll('faq')
      },
      {
        label: 'Courses',
        icon: 'pi pi-book',
        routerLink: ['/categories']
      }
    ];
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated && Boolean(this.currentUser);
  }

  get userRole(): 'student' | 'instructor' | 'admin' {
    const role = this.currentUser?.role?.toLowerCase();

    if (role === 'admin' || this.currentUser?.roleId === 3) {
      return 'admin';
    }

    if (role === 'instructor' || this.currentUser?.roleId === 2) {
      return 'instructor';
    }

    return 'student';
  }

  get dashboardUrl(): string {
    return `/${this.userRole}/dashboard`;
  }

  get userInitials(): string {
    const name = this.currentUser?.name?.trim();

    if (!name) {
      return 'JD';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  navigateAndScroll(sectionId: string): void {
    if (this.router.url.split('?')[0].split('#')[0] !== '/') {
      this.router.navigate(['/']).then(() => {
        requestAnimationFrame(() => this.scrollToSection(sectionId));
      });
      return;
    }

    this.scrollToSection(sectionId);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset -
      80;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });

    this.mobileSidebarVisible = false;
  }

  private updateShellVisibility(): void {
    let currentRoute = this.route.snapshot;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    this.showShell = currentRoute.data['showPublicShell'] !== false;
  }
  goTo(type: 'student' | 'instructor' | 'admin'): void {
    console.log(`Navigating to ${type} login page...`);
    switch (type) {
      case 'student':
        this.router.navigate(['/login']);
        break;

      case 'instructor':
        // public instructor login page (route: /login)
        this.router.navigate(['/instructor/login']);
        break;

      case 'admin':
        // public admin login page (route: /login)
        this.router.navigate(['/admin/login']);
    }
  }
}


