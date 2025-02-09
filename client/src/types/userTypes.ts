export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profileImgUrl?: string;
  profileImgPublicId?: string;
  eventsAttendingIds?: string[];
}
