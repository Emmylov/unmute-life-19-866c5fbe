
import { supabase, SUPABASE_URL, SUPABASE_KEY } from './client';

/**
 * Creates helper database functions in Supabase.
 * This should be called when the application starts.
 */
export const setupSupabaseFunctions = async () => {
  try {
    // Check if check_table_exists function exists using raw fetch API
    const checkFunctionResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/check_table_exists`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ table_name: "pg_proc" })
      }
    );
    
    // If the function doesn't exist yet, create it
    if (!checkFunctionResponse.ok) {
      console.log('Creating check_table_exists function...');
      
      // Try to create the function through RPC
      const createFunctionResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/create_check_table_exists_function`,
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        }
      );
      
      // If the RPC doesn't exist yet, create the functions using raw SQL
      if (!createFunctionResponse.ok) {
        // Create raw SQL execution function
        const sqlQuery = `
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
        `;
        
        try {
          // Execute raw SQL using the REST API
          const rawSqlResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/create_raw_sql`,
            {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ sql_query: sqlQuery })
            }
          );
          
          if (!rawSqlResponse.ok) {
            console.error('Error creating functions:', await rawSqlResponse.text());
            throw new Error('Failed to create database functions');
          }
        } catch (sqlError) {
          console.error('Error executing raw SQL:', sqlError);
        }
      }
    }

    // Setup realtime subscriptions for key tables
    await setupRealtimeSubscriptions();

  } catch (error) {
    console.error('Error in setupSupabaseFunctions:', error);
  }
};

// Setup realtime subscriptions for the app
const setupRealtimeSubscriptions = async () => {
  try {
    // Enable realtime for key tables
    const tables = [
      'profiles',
      'posts_images',
      'posts_text', 
      'posts_reels',
      'post_comments',
      'post_likes',
      'notifications',
      'user_follows'
    ];
    
    // For each table, check if it exists and enable realtime if it does
    for (const table of tables) {
      const tableExists = await checkIfTableExists(table);
      if (tableExists) {
        try {
          // Enable REPLICA IDENTITY FULL for the table
          await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/create_raw_sql`,
            {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                sql_query: `ALTER TABLE public.${table} REPLICA IDENTITY FULL;`
              })
            }
          );
          
          console.log(`Enabled REPLICA IDENTITY FULL for ${table}`);
        } catch (error) {
          console.warn(`Could not enable REPLICA IDENTITY FULL for ${table}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error setting up realtime subscriptions:', error);
  }
};

// Helper function to check if table exists (from the original file)
export const checkIfTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/check_table_exists`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ table_name: tableName })
      }
    );
    
    if (!response.ok) {
      console.warn(`Could not check if table ${tableName} exists:`, await response.text());
      return false;
    }
    
    const data = await response.json();
    return !!data;
  } catch (error) {
    console.warn(`Could not check if table ${tableName} exists:`, error);
    return false;
  }
};

// Call the setup function when this module is imported
setupSupabaseFunctions().catch(error => {
  console.error('Error setting up Supabase functions:', error);
});
