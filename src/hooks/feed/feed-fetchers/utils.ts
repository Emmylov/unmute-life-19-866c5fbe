
import { SupabaseResponse } from "./types";

/**
 * Helper function to convert Supabase queries to properly typed promises
 * @param query Supabase query builder
 * @returns Promise with properly typed response
 */
export function toTypedPromise<T>(query: any): Promise<SupabaseResponse<T>> {
  return query as Promise<SupabaseResponse<T>>;
}
