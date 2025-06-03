import type { IArticle } from "../types/articleTypes";

export const initializeReactionMaps = (articles: IArticle[]) => {
  const likes: Record<string, string[]> = {};
  const dislikes: Record<string, string[]> = {};
  articles.forEach((article) => {
    if (article._id) {
      likes[article._id] = article.likes || [];
      dislikes[article._id] = article.dislikes || [];
    }
  });
  return { likes, dislikes };
};