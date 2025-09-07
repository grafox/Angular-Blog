
export interface Author {
  id: string;
  name: string;
  profileImage: string;
  bio: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
  author: Author;
  categories: Category[];
  tags: Tag[];
  featuredImage: string;
  viewsCount: number;
}
