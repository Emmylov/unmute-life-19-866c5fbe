
import { FeedPost } from "@/services/post-service";

// Define a type for API responses
export interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

// Define a type for the query function
export type SupabaseQueryFunction<T> = Promise<SupabaseResponse<T>>;

// Define types for the feed fetcher functions
export type FeedFetcherFunction = (userId: string, limit?: number, offset?: number) => Promise<{
  posts: FeedPost[];
  hasMore: boolean;
  error: Error | null;
}>;

export type FeedPostWithUser = {
  post: FeedPost;
  user: {
    id: string;
    username?: string | null;
    avatar?: string | null;
    full_name?: string | null;
  };
};

export interface FeedFetcherResult {
  posts: FeedPost[];
  hasMore: boolean;
  error: Error | null;
}
