export interface CourseProgress {
  courseId: string;
  userId: string;
  lastReadAt?: string;
  completedPercent?: number;
}

