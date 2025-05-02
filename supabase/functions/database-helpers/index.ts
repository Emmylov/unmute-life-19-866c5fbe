
// Helper functions for database operations in edge functions

/**
 * Increments a numeric field
 * @param supabase The Supabase client
 * @param table The table name
 * @param field The field to increment
 * @param id The record ID
 * @param amount The amount to increment by (default: 1)
 * @returns A promise that resolves to the updated record
 */
export async function incrementField(
  supabase: any,
  table: string,
  field: string,
  id: string,
  amount: number = 1
): Promise<any> {
  const { data, error } = await supabase.rpc('increment_field', {
    p_table: table,
    p_field: field,
    p_id: id,
    p_amount: amount
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Decrements a numeric field
 * @param supabase The Supabase client
 * @param table The table name
 * @param field The field to decrement
 * @param id The record ID
 * @param amount The amount to decrement by (default: 1)
 * @returns A promise that resolves to the updated record
 */
export async function decrementField(
  supabase: any,
  table: string,
  field: string,
  id: string,
  amount: number = 1
): Promise<any> {
  const { data, error } = await supabase.rpc('decrement_field', {
    p_table: table,
    p_field: field,
    p_id: id,
    p_amount: amount
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}
