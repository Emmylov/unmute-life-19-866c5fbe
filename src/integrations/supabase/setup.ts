
import { supabase } from './client';

/**
 * Creates helper database functions in Supabase.
 * This should be called when the application starts.
 */
export const setupSupabaseFunctions = async () => {
  try {
    // Use a direct query with SQL since pg_proc is not in the typed schema
    const { data, error } = await supabase
      .rpc('check_table_exists', { table_name: 'pg_proc' })
      .then(() => ({ data: true, error: null }))
      .catch(() => {
        console.log('Creating check_table_exists function...');
        
        // Use a direct query approach since supabase.sql is not available in the client
        return supabase.rpc('create_check_table_exists_function')
          .then(() => ({ data: true, error: null }))
          .catch(() => {
            // If the RPC doesn't exist yet, create the functions manually
            return supabase.rpc('create_raw_sql' as any, { 
              sql_query: `
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
              `
            }).then(() => ({ data: true, error: null }))
            .catch((err) => {
              console.error('Error creating functions:', err);
              return ({ data: false, error: err });
            });
          });
      });

    if (error) {
      console.error('Error setting up Supabase functions:', error);
    }
  } catch (error) {
    console.error('Error in setupSupabaseFunctions:', error);
  }
};

// Call the setup function when this module is imported
setupSupabaseFunctions().catch(error => {
  console.error('Error setting up Supabase functions:', error);
});
