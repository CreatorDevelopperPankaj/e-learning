import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { StorageService } from './storage.service';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

@Injectable({ providedIn: 'root' })
export class TokenService {
  constructor(private readonly storageService: StorageService) {}

  getAccessToken(): string | null {
    return (
      this.storageService.get<string>(ACCESS_TOKEN_KEY, localStorage) ||
      this.storageService.get<string>(ACCESS_TOKEN_KEY, sessionStorage)
    );
  }

  getRefreshToken(): string | null {
    return (
      this.storageService.get<string>(REFRESH_TOKEN_KEY, localStorage) ||
      this.storageService.get<string>(REFRESH_TOKEN_KEY, sessionStorage)
    );
  }

  setTokens(accessToken: string, refreshToken: string, rememberMe = true): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    this.storageService.set(ACCESS_TOKEN_KEY, accessToken, storage);
    this.storageService.set(REFRESH_TOKEN_KEY, refreshToken, storage);

    try {
      const { exp } = jwtDecode<{ exp: number }>(accessToken);
      this.storageService.set(TOKEN_EXPIRY_KEY, exp * 1000, storage);
    } catch {
      this.storageService.set(TOKEN_EXPIRY_KEY, Date.now() + 60 * 60 * 1000, storage);
    }

    this.clearTokens(otherStorage);
  }

  isTokenExpired(): boolean {
    const expiry =
      this.storageService.get<number>(TOKEN_EXPIRY_KEY, localStorage) ??
      this.storageService.get<number>(TOKEN_EXPIRY_KEY, sessionStorage);

    if (!expiry) return true;
    return Date.now() >= expiry;
  }

  getTokenExpiryMs(): number {
    const expiry =
      this.storageService.get<number>(TOKEN_EXPIRY_KEY, localStorage) ??
      this.storageService.get<number>(TOKEN_EXPIRY_KEY, sessionStorage);

    if (!expiry) return 0;
    return Math.max(0, expiry - Date.now());
  }

  clearTokens(storage?: Storage): void {
    if (storage) {
      this.storageService.remove(ACCESS_TOKEN_KEY, storage);
      this.storageService.remove(REFRESH_TOKEN_KEY, storage);
      this.storageService.remove(TOKEN_EXPIRY_KEY, storage);
      return;
    }

    [localStorage, sessionStorage].forEach(s => {
      this.storageService.remove(ACCESS_TOKEN_KEY, s);
      this.storageService.remove(REFRESH_TOKEN_KEY, s);
      this.storageService.remove(TOKEN_EXPIRY_KEY, s);
    });
  }
}