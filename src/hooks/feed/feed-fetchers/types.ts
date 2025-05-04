
import { FeedPost } from "@/services/post-service";

// Define a type for API responses
export interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

// Define a type for the query function
export type SupabaseQueryFunction<T> = Promise<SupabaseResponse<T>>;

// Define types for the feed fetcher functions
export type FetchTrendingFeedFunc = (limit: number, offset: number) => Promise<FeedPost[]>;
export type FetchFollowingFeedFunc = (userId: string, limit: number, offset: number) => Promise<FeedPost[]>;
export type FetchPersonalizedFeedFunc = (userId: string, interests: string[] | undefined, limit: number, offset: number) => Promise<FeedPost[]>;
export type FetchMusicFeedFunc = (limit: number, offset: number) => Promise<FeedPost[]>;
export type FetchCollabsFeedFunc = (limit: number, offset: number) => Promise<FeedPost[]>;

export interface PostWithEngagement {
  id: string;
  user_id: string;
  created_at: string;
  [key: string]: any;
}
