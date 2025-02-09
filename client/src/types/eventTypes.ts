export interface EventData {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  createdBy: UserDetails;
  category: CategoryDetails;
  attendees: UserDetails[];
}

export interface UserDetails {
  id: string;
  username: string;
  email: string;
}

export interface CategoryDetails {
  id: string;
  title: string;
}

export interface EventCreateData {
  title: string;
  description: string;
  date: string;
  categoryId: string;
}
