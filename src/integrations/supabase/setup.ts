
import { supabase } from './client';

/**
 * Creates helper database functions in Supabase.
 * This should be called when the application starts.
 */
export const setupSupabaseFunctions = async () => {
  // Check if the check_table_exists function already exists
  const { data: functionExists, error: checkError } = await supabase
    .from('pg_proc')
    .select('proname')
    .eq('proname', 'check_table_exists')
    .maybeSingle()
    .then(() => ({ data: true, error: null }))
    .catch(() => ({ data: false, error: null }));
    
  if (!functionExists) {
    // Create the function to check if a table exists
    await supabase.rpc('create_check_table_exists_function').catch(() => {
      console.log('Creating check_table_exists function...');
      return supabase.sql(`
        CREATE OR REPLACE FUNCTION public.check_table_exists(table_name TEXT)
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          RETURN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = $1
          );
        END;
        $$;
        
        CREATE OR REPLACE FUNCTION public.create_check_table_exists_function()
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          RETURN TRUE;
        END;
        $$;
      `);
    });
  }
};

// Call the setup function when this module is imported
setupSupabaseFunctions().catch(error => {
  console.error('Error setting up Supabase functions:', error);
});
