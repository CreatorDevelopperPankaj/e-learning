import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string, storage: Storage = localStorage): T | null {
    const value = storage.getItem(key);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  set<T>(key: string, value: T, storage: Storage = localStorage): void {
    storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string, storage: Storage = localStorage): void {
    storage.removeItem(key);
  }
}
