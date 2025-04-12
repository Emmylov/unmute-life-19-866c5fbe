
import { supabase } from "@/integrations/supabase/client";
import { SupabaseResponse } from "./types";

/**
 * Helper function to properly type Supabase queries
 * This addresses the TypeScript error where dynamic table/function names aren't in the generated types
 */
export function toTypedPromise<T>(query: Promise<any>): Promise<SupabaseResponse<T>> {
  return query as Promise<SupabaseResponse<T>>;
}

/**
 * Helper function specifically for RPC calls that aren't in the generated types
 * This addresses the TypeScript errors in trending-feed.ts
 */
export function rpcCall<T>(functionName: string, params?: Record<string, any>): Promise<SupabaseResponse<T>> {
  // Using type assertion to bypass TypeScript's strict checking for dynamic RPC function calls
  return (supabase.rpc as any)(functionName, params) as Promise<SupabaseResponse<T>>;
}

/**
 * Helper function for accessing tables that aren't in the generated types
 * This addresses the TypeScript errors in collabs-feed.ts
 */
export function dynamicTableQuery<T>(tableName: string) {
  // Using type assertion to bypass TypeScript's strict checking for dynamic table names
  return (supabase.from as any)(tableName) as {
    select: (columns: string) => {
      order: (column: string, options: { ascending: boolean }) => {
        range: (from: number, to: number) => Promise<SupabaseResponse<T>>
      }
    }
  };
}
