
import { supabase } from "@/integrations/supabase/client";
import { PostgrestQueryBuilder } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types-patch";

// Generic type-safe query execution function
export async function toTypedPromise<T>(query: PostgrestQueryBuilder<Database, never>) {
  const result = await query.select().execute();
  return result as { data: T | null; error: any };
}

// Enhanced RPC call function with type safety
export async function rpcCall<T>(
  fn: string, 
  params: Record<string, any> = {}
): Promise<{ data: T | null; error: any }> {
  const result = await supabase.rpc(fn, params).execute();
  return result as { data: T | null; error: any };
}

// Dynamic table query helper
export function dynamicTableQuery<T>(tableName: keyof Database['public']['Tables']) {
  return supabase.from(tableName) as unknown as PostgrestQueryBuilder<Database, never>;
}
