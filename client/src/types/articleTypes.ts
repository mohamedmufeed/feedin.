export interface IArticle {
  _id?: string; 
  author: {
    _id:string;
    firstName:string;
    lastName:string;
    profileImage:string
  };
  title: string;
  subtitle?: string;
  coverImage?: string| null;
  content: string;
  category: string;
  likes: string[];
  dislikes: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
