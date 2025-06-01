import { Schema, model, Types } from 'mongoose';

const articleSchema = new Schema(
  {
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Article = model('Article', articleSchema);
export default Article;
