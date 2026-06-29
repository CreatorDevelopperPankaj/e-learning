import { FileAttachment } from './file-attachment.model';

export interface ChatReaction { emoji: string; userIds: string[]; }
export interface ChatMessage {
  id?: string; _id?: string; courseId?: string; channelId: string; memberId?: string;
  senderId: string; senderName: string; senderRole: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | string;
  type: 'TEXT' | 'FILE' | 'CODE' | 'ASSIGNMENT' | 'ANNOUNCEMENT' | 'LIVE_CLASS' | 'SYSTEM';
  text: string; attachments: FileAttachment[]; reactions: ChatReaction[]; seenBy: string[];
  replyTo?: ChatMessage | string | null; isPinned: boolean; isEdited: boolean; createdAt: string; updatedAt?: string;
}

export interface MessagePage { success: boolean; messages: ChatMessage[]; }
