export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userProfileImage: string;
  content: string;
  createdAt: Date;
  status: 'approved' | 'pending' | 'rejected';
}
