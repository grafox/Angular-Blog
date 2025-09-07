export enum UserRole {
  Admin = 'Admin',
  Editor = 'Editor',
  Author = 'Author',
  Visitor = 'Visitor'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage: string;
}
