import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiConstants } from '../constants/api.constants';
import { UserModel } from '../models/user.model';
import { StorageService } from './storage.service';
import { TokenService } from './token.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  role: 'student' | 'instructor';
  roleId: 1 | 2;
  profileImage?: string;
  profileImageFileName?: string;
  profileImageFilePath?: string;
  profileImageFullUrl?: string;
  bio?: string;
  country?: string;
  city?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: UserModel;
}

// Key used to persist the logged-in user object in storage
const AUTH_USER_KEY = 'authUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageService);
  private readonly tokenService = inject(TokenService);

  // BehaviorSubject holds the current logged-in user.
  // Initialized from storage so user stays logged in after page refresh.
  private readonly currentUserSubject = new BehaviorSubject<UserModel | null>(
    this.getStoredUser()
  );

  // Public observable — components subscribe to this to react to auth state changes
  readonly currentUser$ = this.currentUserSubject.asObservable();

  // ----------------------------------------------------------------
  // Login Methods
  // ----------------------------------------------------------------

  // Student login — calls /api/users/login
  login(payload: LoginRequest, rememberMe: boolean): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.buildUrl(ApiConstants.auth.login), payload)
      .pipe(tap((response) => this.persistSession(response, rememberMe)));
  }

  // Instructor login — calls /api/instructor/login
  instructorLogin(payload: LoginRequest, rememberMe: boolean): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.buildUrl(ApiConstants.auth.instructorLogin), payload)
      .pipe(tap((response) => this.persistSession(response, rememberMe)));
  }

  // Admin login — calls /api/admin/auth/login
  adminLogin(payload: LoginRequest, rememberMe: boolean): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.buildUrl(ApiConstants.auth.adminLogin), payload)
      .pipe(tap((response) => this.persistSession(response, rememberMe)));
  }

  // ----------------------------------------------------------------
  // Register Methods
  // ----------------------------------------------------------------

  // Student registration — supports both JSON and FormData payloads
  register(payload: RegisterRequest | FormData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.buildUrl(ApiConstants.auth.register), payload as any)
      .pipe(tap((response) => this.persistSession(response, true)));
  }

  // Instructor registration — does NOT auto-persist session (manual approval flow)
  instructorRegister(payload: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.buildUrl(ApiConstants.auth.instructorRegister), payload);
  }

  // ----------------------------------------------------------------
  // Logout
  // ----------------------------------------------------------------

  // Clears all tokens and user data from storage, resets current user to null
  logout(): void {
    this.tokenService.clearTokens();
    this.storageService.remove(AUTH_USER_KEY, localStorage);
    this.storageService.remove(AUTH_USER_KEY, sessionStorage);
    this.currentUserSubject.next(null);
  }

  // ----------------------------------------------------------------
  // Getters
  // ----------------------------------------------------------------

  // Returns the current logged-in user synchronously (no subscription needed)
  get currentUser(): UserModel | null {
    return this.currentUserSubject.value;
  }

  // Returns true only if a valid, non-expired token exists in storage.
  // Used by AuthGuard on every route navigation.
  get isAuthenticated(): boolean {
    return (
      Boolean(this.tokenService.getAccessToken()) &&
      !this.tokenService.isTokenExpired()
    );
  }

  // ----------------------------------------------------------------
  // Private Helpers
  // ----------------------------------------------------------------

  // Saves tokens + user to storage after a successful login/register response.
  // rememberMe=true → localStorage, rememberMe=false → sessionStorage
  private persistSession(response: AuthResponse, rememberMe: boolean): void {
    // Save access token, refresh token, and decoded expiry time
    this.tokenService.setTokens(response.accessToken, response.refreshToken, rememberMe);

    // Save user object to the appropriate storage
    const storage = rememberMe ? localStorage : sessionStorage;
    const fallbackStorage = rememberMe ? sessionStorage : localStorage;
    this.storageService.set(AUTH_USER_KEY, response.user, storage);

    // Remove user from the other storage to prevent stale data conflicts
    this.storageService.remove(AUTH_USER_KEY, fallbackStorage);

    // Notify all subscribers that a new user has logged in
    this.currentUserSubject.next(response.user);
  }

  // Reads the stored user object on app startup (supports both storage types)
  private getStoredUser(): UserModel | null {
    return (
      this.storageService.get<UserModel>(AUTH_USER_KEY, localStorage) ||
      this.storageService.get<UserModel>(AUTH_USER_KEY, sessionStorage)
    );
  }

  // Constructs the full API URL by combining base URL with the given path
  private buildUrl(path: string): string {
    return `${environment.apiBaseUrl}${path}`;
  }


// refreshSession() method add karo
refreshSession(): Observable<AuthResponse> {
  const refreshToken = this.tokenService.getRefreshToken();

  return this.http
    .post<AuthResponse>(this.buildUrl(ApiConstants.auth.refreshToken), { refreshToken })
    .pipe(
      tap((response) => {
        const rememberMe = Boolean(
          this.storageService.get(AUTH_USER_KEY, localStorage)
        );
        this.persistSession(response, rememberMe);
      })
    );
}
}