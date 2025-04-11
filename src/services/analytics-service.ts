
import { supabase } from "@/integrations/supabase/client";

// Analytics tracking
export const trackAnalyticEvent = async (userId: string, eventType: string, eventData: any = {}) => {
  try {
    // For TypeScript safety, using type assertion
    const { data, error } = await supabase
      .from('user_analytics' as any)
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData
      });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error tracking analytic event:", error);
    // Don't throw here so it doesn't interrupt user experience
    return null;
  }
};

export const getUserAnalytics = async (userId: string, eventType?: string, startDate?: string, endDate?: string) => {
  try {
    // For TypeScript safety, using type assertion
    let query = supabase
      .from('user_analytics' as any)
      .select('*')
      .eq('user_id', userId);
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting user analytics:", error);
    throw error;
  }
};
