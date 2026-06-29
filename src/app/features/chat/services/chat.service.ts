import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ChatMessage, MessagePage } from '../models/chat-message.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient); private readonly base = `${environment.apiBaseUrl}/v1/chat`;
  messages(channelId: string, page = 1, limit = 50): Observable<MessagePage> {
    return this.http.get<MessagePage>(`${this.base}/${channelId}/messages`, { params: { page, limit } });
  }

  send(channelId: string, payload: Partial<ChatMessage>): Observable<{ success: boolean; message: ChatMessage }> {
    return this.http.post<{ success: boolean; message: ChatMessage }>(`${this.base}/${channelId}/messages`, payload);
  }

  edit(messageId: string, newText: string) {
    return this.http.patch(`${this.base}/messages/${messageId}`, { newText });
  }

  delete(messageId: string) {
    return this.http.delete(`${this.base}/messages/${messageId}`);
  }
  react(messageId: string, emoji: string) {
    return this.http.post(`${this.base}/messages/${messageId}/react`, { emoji });
  }
  removeReaction(messageId: string, emoji: string) {
    return this.http.delete(`${this.base}/messages/${messageId}/react`, { body: { emoji } });
  }
  pin(messageId: string, isPinned: boolean) {
    return isPinned ? this.http.post(`${this.base}/messages/${messageId}/pin`, { isPinned }) : this.http.delete(`${this.base}/messages/${messageId}/pin`);
  }
  seen(messageId: string) {
    return this.http.post(`${this.base}/messages/${messageId}/seen`, {});
  }
  pinned(channelId: string): Observable<MessagePage> {
    return this.http.get<MessagePage>(`${this.base}/${channelId}/pinned`);
  }
  search(channelId: string, q: string): Observable<MessagePage> {
    return this.http.get<MessagePage>(`${this.base}/${channelId}/search`, { params: new HttpParams().set('q', q) });
  }

  files(channelId: string): Observable<{ success: boolean; files: any[] }> { return this.http.get<{ success: boolean; files: any[] }>(`${this.base}/${channelId}/files`); }
}
