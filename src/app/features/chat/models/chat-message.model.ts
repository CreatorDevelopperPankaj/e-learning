export interface ChatMessage {
  id: string;
  courseId: string;
  channelId: string;
  memberId: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
  editedAt?: string;
}

