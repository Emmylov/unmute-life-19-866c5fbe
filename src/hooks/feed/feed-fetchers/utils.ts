
import { SupabaseQueryFunction, SupabaseResponse } from "./types";

// Helper function to convert Supabase queries to properly typed promises
export function toTypedPromise<T>(query: any): SupabaseQueryFunction<T> {
  return query as Promise<SupabaseResponse<T>>;
}

// Helper function to sort posts by creation date
export function sortPostsByDate<T extends { created_at: string }>(posts: T[]): T[] {
  return posts.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
