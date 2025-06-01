import { Types } from 'mongoose';

export interface IArticle {
  _id?: Types.ObjectId; 
  author: Types.ObjectId;
  title: string;
  subtitle?: string;
  coverImage?: string;
  content: string;
  category: string;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  isDeleted:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
