import { Routes } from '@angular/router';

import { AuthChatGuard } from './guards/auth-chat.guard';
import { ChatShellComponent } from './chat-shell/chat-shell.component';

// Feature routes for lazy mounting inside StudentLayout and InstructorLayout.
export const CHAT_ROUTES: Routes = [
  {
    path: 'chat/:courseId',
    component: ChatShellComponent,
    canActivate: [AuthChatGuard]
  },
  {
    path: 'chat/:courseId/channel/:channelId',
    component: ChatShellComponent,
    canActivate: [AuthChatGuard]
  }
];


