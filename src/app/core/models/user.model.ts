export interface UserModel {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  profileImage?: string;
  profileImageFileName?: string;
  profileImageFilePath?: string;
  profileImageFullUrl?: string;
  role: string;
  roleId: number;
  bio?: string;
  country?: string;
  city?: string;
  isVerified?: boolean;
  instructorStatus?: 'Pending' | 'Approved' | 'Rejected' | 'Blocked';
  createdAt?: string;
  updatedAt?: string;
}
