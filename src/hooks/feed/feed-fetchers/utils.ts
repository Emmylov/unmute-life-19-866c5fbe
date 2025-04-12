
import { supabase } from "@/integrations/supabase/client";

// Generic type-safe query execution function
export async function toTypedPromise<T>(query: any) {
  return query as { data: T | null; error: any };
}

// Enhanced RPC call function with type safety
export async function rpcCall<T>(
  fn: string, 
  params: Record<string, any> = {}
): Promise<{ data: T | null; error: any }> {
  // Use type assertion to bypass TypeScript's strict checking for RPC function names
  // This is necessary because Supabase's type system doesn't know all possible RPC functions
  const result = await (supabase.rpc as any)(fn, params);
  return result as { data: T | null; error: any };
}

// Check if a table exists in the database
export async function checkTableExists(tableName: string): Promise<boolean> {
  const { data, error } = await rpcCall<boolean>('check_table_exists', { table_name: tableName });
  if (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
  return !!data;
}
