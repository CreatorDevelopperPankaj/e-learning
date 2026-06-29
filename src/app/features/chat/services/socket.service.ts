import { inject, Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../../../core/services/token.service';
import { ChatMessage } from '../models/chat-message.model';
import { ChatCourse } from './chat-course.service';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private readonly tokens = inject(TokenService);
  private socket?: Socket;
  private readonly messagesSubject = new Subject<ChatMessage>();
  private readonly typingSubject = new Subject<{channelId:string;typingUsers:string[]}>();
  private readonly errorsSubject = new Subject<string>();
  private readonly coursesSubject = new Subject<ChatCourse>();
  readonly connected$ = new BehaviorSubject(false);
  readonly messages$: Observable<ChatMessage> = this.messagesSubject.asObservable();
  readonly typing$: Observable<{channelId:string;typingUsers:string[]}> = this.typingSubject.asObservable();
  readonly errors$: Observable<string> = this.errorsSubject.asObservable();
  readonly courses$: Observable<ChatCourse> = this.coursesSubject.asObservable();

  connect(): void {
    if (this.socket) return;
    const serverUrl = environment.apiBaseUrl.replace(/\/api\/?$/, '');
    this.socket = io(serverUrl, { transports: ['websocket'], auth: { token: this.tokens.getAccessToken() }, reconnection: true });
    this.socket.on('connect', () => this.connected$.next(true));
    this.socket.on('disconnect', () => this.connected$.next(false));
    this.socket.on('new_message', message => this.messagesSubject.next(message));
    this.socket.on('course_created', course => this.coursesSubject.next(course));
    this.socket.on('typing_update', value => this.typingSubject.next(value));
    this.socket.on('error', error => this.errorsSubject.next(error?.message || 'Realtime chat error'));
  }
  join(channelId:string):void { this.connect(); this.socket?.emit('join_channel',{channelId}); }
  leave(channelId:string):void { this.socket?.emit('leave_channel',{channelId}); }
  send(channelId:string,payload:{type:string;text:string;attachments?:unknown[]}):boolean { if(!this.socket?.connected)return false;this.socket.emit('send_message',{channelId,payload});return true; }
  typing(channelId:string,userName:string,active:boolean):void { this.socket?.emit(active?'typing_start':'typing_stop',{channelId,userName}); }
  ngOnDestroy():void { this.socket?.disconnect();this.socket=undefined;this.connected$.complete();this.messagesSubject.complete();this.typingSubject.complete();this.errorsSubject.complete();this.coursesSubject.complete(); }
}
