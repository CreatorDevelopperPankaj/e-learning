import { Routes } from '@angular/router';

import { AuthChatGuard } from '../chat/guards/auth-chat.guard';
import { ChatShellComponent } from '../chat/chat-shell/chat-shell.component';

export const studentChatRoutes: Routes = [
  {
    path: ':courseId',
    component: ChatShellComponent,
    canActivate: [AuthChatGuard]
  },
  {
    path: ':courseId/channel/:channelId',
    component: ChatShellComponent,
    canActivate: [AuthChatGuard]
  }
];

