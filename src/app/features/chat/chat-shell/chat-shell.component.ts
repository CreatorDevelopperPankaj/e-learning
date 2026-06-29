import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ChatMessage } from '../models/chat-message.model';
import { Channel } from '../models/channel.model';
import { ChannelService } from '../services/channel.service';
import { ChatService } from '../services/chat.service';
import { FileUploadService } from '../services/file-upload.service';
import { CourseMemberView, MemberService } from '../services/member.service';
import { AiTutorService } from '../services/ai-tutor.service';
import { ChatCourse, ChatCourseService } from '../services/chat-course.service';
import { SocketService } from '../services/socket.service';
import { SidebarLeftComponent } from '../components/sidebar-left/sidebar-left.component';
import { ChatHeaderComponent } from '../components/chat-header/chat-header.component';
import { ChatMessagesComponent } from '../components/chat-messages/chat-messages.component';
import { MessageInputComponent } from '../components/message-input/message-input.component';
import { SidebarRightComponent } from '../components/sidebar-right/sidebar-right.component';

@Component({ selector: 'app-chat-shell', standalone: true, imports: [CommonModule, RouterModule, SidebarLeftComponent, ChatHeaderComponent, ChatMessagesComponent, MessageInputComponent, SidebarRightComponent], templateUrl: './chat-shell.component.html', styleUrls: ['./chat-shell.component.scss'], changeDetection: ChangeDetectionStrategy.OnPush })
export class ChatShellComponent {
  private route = inject(ActivatedRoute); private router = inject(Router); private destroyRef = inject(DestroyRef); private chats = inject(ChatService); private channelsApi = inject(ChannelService); private courseApi = inject(ChatCourseService); private membersApi = inject(MemberService); private uploads = inject(FileUploadService); private tutor = inject(AiTutorService); private socket = inject(SocketService); private auth = inject(AuthService);
  readonly courses = signal<ChatCourse[]>([]);
  readonly courseId = signal('');
  readonly channelId = signal('');
  readonly channels = signal<Channel[]>([]);
  readonly messages = signal<ChatMessage[]>([]);
  readonly members = signal<CourseMemberView[]>([]);
  readonly pinned = signal<ChatMessage[]>([]);
  readonly files = signal<any[]>([]);
  readonly progress = signal(0);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly currentUserId = this.auth.currentUser?.id || '';
  readonly canAddCourse = this.auth.currentUser?.role === 'instructor';

  private normalizeRole(role: unknown): string {
    return String(role ?? '').trim().toLowerCase();
  }

  studentsCount(): number {
    return (this.members() || []).filter((m) => this.normalizeRole(m.role) === 'student').length;
  }

  instructorsCount(): number {
    return (this.members() || []).filter((m) => this.normalizeRole(m.role) === 'instructor').length;
  }


  constructor() {
    this.socket.connect();
    this.socket.messages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(message => { if (String(message.channelId) === this.channelId() && !this.messages().some(item => (item._id || item.id) === (message._id || message.id))) this.messages.update(items => [...items, message]); });
    this.socket.courses$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(course => { if (!this.courses().some(item => (item._id || item.id) === (course._id || course.id))) this.courses.update(items => [...items, course]); });
    this.socket.errors$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(message => this.error.set(message));
    this.courseApi.list().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: r => this.courses.set(r.data || []) });
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => { const course = params.get('courseId') || ''; this.courseId.set(course); this.channelId.set(params.get('channelId') || ''); course ? this.load() : this.loadCourses(); });
  }
  loadCourses(): void { this.loading.set(true); this.courseApi.list().subscribe({ next: r => { this.courses.set(r.data || []); const first = r.data?.[0]; if (first) this.selectCourse(first); else this.loading.set(false) }, error: e => { this.error.set(e.error?.message || 'Unable to load courses'); this.loading.set(false) } }) }
  load(): void {
    const courseId = this.courseId();
    if (!courseId || courseId === 'my-courses') {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set('');

    // Always load members as soon as courseId is available (even if channel is not resolved yet)
    void this.membersApi.list(courseId).subscribe({
      next: (r) => this.members.set(r.data || []),
      error: () => {
        // members are non-blocking for chat render
      }
    });

    this.channelsApi
      .list(courseId)
      .pipe(
        switchMap((result) => {
          const channels = result.data || [];
          this.channels.set(channels);

          const selected =
            this.channelId() || channels[0]?._id || channels[0]?.id || '';

          if (selected && selected !== this.channelId()) {
            this.channelId.set(selected);
            void this.router.navigateByUrl(
              `${this.router.url.split('/channel/')[0]}/channel/${selected}`
            );
          }

          const progress$ = this.auth.currentUser?.role === 'student'
            ? this.membersApi.progress(courseId)
            : of({ success: true, data: { completedPercent: 0 } });

          return selected
            ? forkJoin({
                messages: this.chats.messages(selected),
                pinned: this.chats.pinned(selected),
                files: this.chats.files(selected),
                progress: progress$
              })
            : of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          if (data) {
            console.log('data',data)
            this.messages.set(data.messages.messages || []);
            this.pinned.set(data.pinned.messages || []);
            this.files.set(data.files.files || []);
            this.progress.set(data.progress.data?.completedPercent || 0);
            this.socket.join(this.channelId());
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Unable to load chat');
          this.loading.set(false);
        }
      });
  }

  selectChannel(channel: Channel): void { const id = channel._id || channel.id || ''; if (!id) return; this.channelId.set(id); void this.router.navigateByUrl(`${this.router.url.split('/channel/')[0]}/channel/${id}`); }

  selectCourse(course: ChatCourse): void { const id = course._id || course.id || ''; if (!id) return; const role = this.auth.currentUser?.role === 'instructor' ? 'instructor' : 'student'; if (role === 'student') this.courseApi.join(id).subscribe({ next: () => void this.router.navigate([`/${role}/chat`, id]), error: e => this.error.set(e.error?.message || 'Could not join course') }); else void this.router.navigate([`/${role}/chat`, id]); }
 
 
  addCourse(): void { const title = window.prompt('Course title'); if (!title?.trim()) return; const description = window.prompt('Short course description') || ''; this.courseApi.create({ title: title.trim(), description }).subscribe({ next: r => { this.courses.update(items => items.some(x => (x._id || x.id) === (r.data._id || r.data.id)) ? items : [...items, r.data]); this.selectCourse(r.data) }, error: e => this.error.set(e.error?.message || 'Course could not be created') }) }
 
  startDirect(member: CourseMemberView): void { if (!this.courseId() || member.id === this.currentUserId) return; this.channelsApi.direct(this.courseId(), member.id).subscribe({ next: r => { const channel = { ...r.data, name: member.name, icon: 'person', type: 'direct' }; this.channels.update(items => items.some(x => (x._id || x.id) === (channel._id || channel.id)) ? items : [...items, channel]); this.selectChannel(channel) }, error: e => this.error.set(e.error?.message || 'Private chat could not be opened') }) }
 
  send(text: string, attachment?: any): void { const channel = this.channelId(); if (!channel) { this.error.set('Select a course and channel first'); return } const payload: any = { type: attachment ? 'FILE' : 'TEXT', text, attachments: attachment ? [attachment] : [] }; if (!this.socket.send(channel, payload)) this.chats.send(channel, payload).subscribe({ next: r => this.messages.update(items => [...items, r.message]), error: e => this.error.set(e.error?.message || 'Message could not be sent') }); }
 
  upload(file: File): void { this.uploads.upload(file).subscribe({ next: result => this.send(file.name, result.data), error: e => this.error.set(e.error?.message || 'Upload failed') }); }
 
  react(event: { message: ChatMessage; emoji: string }): void { const id = event.message._id || event.message.id; if (!id) return; this.chats.react(id, event.emoji).subscribe(() => this.load()); }
 
  pin(message: ChatMessage): void { const id = message._id || message.id; if (!id) return; this.chats.pin(id, !message.isPinned).subscribe(() => this.load()); }
 
  search(query: string): void { if (!query.trim()) { this.load(); return } this.loading.set(true); this.chats.search(this.channelId(), query).subscribe({ next: r => { this.messages.set(r.messages); this.loading.set(false) }, error: e => { this.error.set(e.error?.message || 'Search failed'); this.loading.set(false) } }) }
 
  askTutor(question: string): void { this.tutor.ask(question, this.courseId()).subscribe({ next: r => this.messages.update(items => [...items, { channelId: this.channelId(), senderId: 'ai', senderName: 'AI Tutor', senderRole: 'SYSTEM', type: 'SYSTEM', text: r.data.answer, attachments: [], reactions: [], seenBy: [], isPinned: false, isEdited: false, createdAt: new Date().toISOString() }]), error: e => this.error.set(e.error?.message || 'AI Tutor is unavailable') }) }
 
  channelTitle(): string { return this.channels().find(c => (c._id || c.id) === this.channelId())?.name || 'Course Chat' }
}
