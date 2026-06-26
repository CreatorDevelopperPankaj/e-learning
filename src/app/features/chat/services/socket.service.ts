import { Injectable, OnDestroy } from '@angular/core';

// socket.io-client typings are intentionally optional at this foundation stage.
// If the dependency exists, it will be used; otherwise this service remains compile-safe.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SocketLike = any;


@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  private socket: SocketLike | null = null;


  /**
   * Connection only (no event wiring yet).
   * Consumers can use getSocket() later.
   */
  connect(): SocketLike {
    if (this.socket) return this.socket;

    // NOTE: Replace with environment value when available.
    const url = 'http://localhost:3000';

    try {
      // If socket.io-client exists, connect immediately; otherwise return null.
      // We avoid require() to keep the build TypeScript-safe.
      // @ts-ignore - optional dependency at foundation phase
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = (globalThis as any).require?.('socket.io-client') as { io?: (u: string, opts?: unknown) => SocketLike } | undefined;

      if (!mod?.io) return null as SocketLike;

      this.socket = mod.io(url, {
        transports: ['websocket'],
        autoConnect: true
      });

      return this.socket;
    } catch {
      this.socket = null;
      return null as SocketLike;
    }
  }


  getSocket(): SocketLike | null {
    return this.socket;
  }


  ngOnDestroy(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}

