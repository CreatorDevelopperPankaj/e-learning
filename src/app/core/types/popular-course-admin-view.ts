export interface PopularCourseAdminView {
  id: string;
  courseId: string;
  score: number;
  course: {
    id: string;
    title: string;
    slug?: string;
    shortDescription: string;
    thumbnail: string;

    rating: number;
    totalRatings: number;
    totalStudents: number;
    duration: string;
    totalLectures: number;
    level: string;

    instructorName: string;
    instructorImage: string;

    price: number;
    discountPrice: number;
    currency: string;
    category: string;

    isPublished?: boolean;
    updatedAt?: string;
    coverImageUrl?: string;
  };
}

