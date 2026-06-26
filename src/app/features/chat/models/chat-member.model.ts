export interface ChatMember {
  id: string;
  courseId: string;
  channelId: string;
  userId: string;
  role: 'member' | 'instructor' | 'admin' | 'moderator';
  joinedAt: string;
}

