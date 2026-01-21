export type LivePostPage = {
  title: string;
  description: string;
  navCards: FlashCard[];
  popularCards: FlashCard[];
  isFetching: boolean;
};

export type Post = {
  id: number;
  date: string;
  title: string;
  content: string;
  userId: number;
  userName: string;
  slug: string;
  reactions: ReactionEmojiCount;
}

export type AuthorUser = {
  id: number;
  authId: string;
  name: string;
}

export type AddPost = {
  title: string;
  content: string;
  userId: number;
}

export type ReactPost = {
  postId: number;
  reaction: string;
}

export type FlashCard = {
  title: string;
  catchPhrase: string;
  link?: {
    to: string;
    text: string;
  }|undefined;
  author?: string|undefined;
  timeAgo?: string|undefined;
  reactEmoji?: ReactionEmojiCount|undefined;
};

export interface ReactionEmoji {
  [key: string]: string;
}

export interface ReactionEmojiCount {
  [key: string]: number;
}

interface ReactEnv {
  [key: string]: string;
}

declare global {
  interface Window {
    ENV?: ReactEnv;
  }
}
