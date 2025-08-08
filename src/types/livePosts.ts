export type LivePostPage = {
  title: string;
  description: string;
  navCards: FlashCard[];
  popularCards: FlashCard[];
  isFetching: boolean;
};

export type Post = {
  id: string;
  date: Date;
  title: string;
  content: string;
  user: string;
  reactions: ReactionEmojiCount;
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
