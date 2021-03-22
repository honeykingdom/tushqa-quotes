import type { NextApiRequest, NextApiResponse } from "next-auth/_utils";

export type QuoteType = {
  id: string;
  message: string;
  messageParts: MessagePart[];
  channels: {
    name: string;
    count: number;
    timestamps?: number[];
  }[];
  timestamp: number;
  count: number;
  fullRating: number;
  userRating: number | null;
};

export type RawQuoteType = Omit<QuoteType, "fullRating" | "userRating">;

export type TwitchEmote = [type: "twitch", id: string | number, name: string];

export type BttvEmote = [type: "bttv", id: string, name: string];

export type FfzEmote = [type: "ffz", id: string | number, name: string];

export type Emoji = [type: "emoji", short: string, unified: string];

export type MessagePart = TwitchEmote | BttvEmote | FfzEmote | Emoji | string;

export type User = {
  email: string;
  exp: number;
  iat: number;
  name: string;
  picture: string;
  sub: string;
};

export type FiltersType = {
  sortBy: "date" | "rating" | "count";
  sortOrder: "asc" | "desc";
  minCount: number;
};

export type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
  getUserId: () => Promise<string | null>;
  getQuotes: () => Promise<QuoteType[]>;
};

export enum RatingValue {
  DOWNVOTE = -1,
  DEFAULT = 0,
  UPVOTE = 1,
}
