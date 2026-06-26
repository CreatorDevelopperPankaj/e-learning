export interface Poll {
  id: string;
  courseId: string;
  channelId?: string;
  question: string;
  options: Array<{ id: string; label: string }>;
  closesAt?: string;
}

