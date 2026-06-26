import {
  Component, signal, OnInit, inject,
  ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef
} from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { TokenExpiryWarningComponent } from './shared/components/token-expiry-warning.component/token-expiry-warning.component';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, ToastModule, TokenExpiryWarningComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  protected readonly title = signal('e-learning');

  // Controls whether the session expiry warning popup is visible
  showExpiryWarning = false;

  private readonly authService  = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly router       = inject(Router);
  private readonly cdr          = inject(ChangeDetectorRef);
  private readonly destroyRef   = inject(DestroyRef);

  // Only warningTimer — no logoutTimer (user action ka wait karega)
  private warningTimer!: ReturnType<typeof setTimeout>;

  constructor() {
    // Default: light theme
    document.body.classList.remove('dark');

    // Restore saved theme from localStorage
    const saved = localStorage.getItem('theme');
    if (saved === 'dark')  document.body.classList.add('dark');
    if (saved === 'light') document.body.classList.remove('dark');
  }

  ngOnInit(): void {
    // React to login/logout events via currentUser$ observable
    this.authService.currentUser$.subscribe(user => {
      // Clear any existing warning timer on auth state change
      clearTimeout(this.warningTimer);

      if (user) {
        // User logged in — start watching token expiry
        console.log('👤 User logged in — starting expiry watcher');
        this.startExpiryWatcher();
      } else {
        // User logged out — hide popup
        console.log('👤 User logged out — clearing popup');
        this.showExpiryWarning = false;
        this.cdr.markForCheck();
      }
    });

    // Clear timer when app component is destroyed
    this.destroyRef.onDestroy(() => {
      clearTimeout(this.warningTimer);
    });
  }

  // Sets a timer to show the warning popup 1 minute before token expiry.
  // No force logout timer — popup freezes at 0 and waits for user action.
  startExpiryWatcher(): void {
    if (!this.authService.isAuthenticated) {
      console.log('❌ Not authenticated — watcher skipped');
      return;
    }

    const remainingMs = this.tokenService.getTokenExpiryMs();
    const warningAt   = remainingMs - 60 * 1000; // 1 minute before expiry

    console.log('⏳ Token expires in  :', Math.floor(remainingMs / 1000), 's');
    console.log('⏰ Popup will open in :', Math.floor(warningAt / 1000), 's');

    if (warningAt > 0) {
      // Show popup exactly 1 minute before token expires
      this.warningTimer = setTimeout(() => {
        console.log('🔔 Popup opening now!');
        this.showExpiryWarning = true;
        this.cdr.markForCheck();
      }, warningAt);

    } else if (remainingMs > 0) {
      // Less than 1 minute remaining — show popup immediately
      console.log('⚠️ Less than 1 min left — showing popup immediately');
      this.showExpiryWarning = true;
      this.cdr.markForCheck();
    }

    // ✅ No logoutTimer — popup freezes at 0, waits for user to click
  }

  // "Continue Session" button clicked — hit refresh token API
  stayLoggedIn(): void {
    this.authService.refreshSession().subscribe({
      next: () => {
        console.log('✅ Session refreshed — restarting watcher');
        this.showExpiryWarning = false;
        clearTimeout(this.warningTimer);
        this.startExpiryWatcher(); // Restart watcher for new token
        this.cdr.markForCheck();
      },
      error: () => {
        // Refresh token failed — logout user
        console.log('❌ Refresh failed — logging out');
        this.logoutNow();
      }
    });
  }

  // "Logout" button clicked — clear session and redirect to role-based login page
  logoutNow(): void {
    this.showExpiryWarning = false;
    clearTimeout(this.warningTimer);
    this.authService.logout();
    this.router.navigate([this.getLoginPage()]);
    this.cdr.markForCheck();
  }

  // Returns the correct login page URL based on the user's role
  private getLoginPage(): string {
    const user = this.authService.currentUser;
    const role = user?.role?.toLowerCase() ??
                 (user?.roleId === 3 ? 'admin' :
                  user?.roleId === 2 ? 'instructor' : 'student');

    const roleLoginMap: Record<string, string> = {
      admin:      '/admin/login',
      instructor: '/instructor/login',
      student:    '/login'
    };

    return roleLoginMap[role] ?? '/login';
  }
}