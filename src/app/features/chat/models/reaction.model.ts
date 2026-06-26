export interface Reaction {
  id: string;
  messageId: string;
  memberId: string;
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry' | string;
  createdAt: string;
}

