
import { supabase } from "@/integrations/supabase/client";

// Save a wellness goal
export const saveWellnessGoal = async (userId: string, goal: {
  title: string;
  description?: string;
  target_date?: string;
  category: string;
  target_value?: number;
  unit?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("wellness_goals")
      .insert({
        user_id: userId,
        ...goal,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error saving wellness goal:", error);
    throw error;
  }
};

// Get wellness goals for a user
export const getWellnessGoals = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("wellness_goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching wellness goals:", error);
    throw error;
  }
};

// Update a wellness goal
export const updateWellnessGoal = async (goalId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from("wellness_goals")
      .update(updates)
      .eq("id", goalId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error updating wellness goal:", error);
    throw error;
  }
};

// Delete a wellness goal
export const deleteWellnessGoal = async (goalId: string) => {
  try {
    const { error } = await supabase
      .from("wellness_goals")
      .delete()
      .eq("id", goalId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting wellness goal:", error);
    throw error;
  }
};

// Log a wellness activity
export const logWellnessActivity = async (userId: string, activity: {
  type: string;
  duration?: number;
  notes?: string;
  mood?: string;
  intensity?: number;
  goal_id?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("wellness_activities")
      .insert({
        user_id: userId,
        ...activity,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error logging wellness activity:", error);
    throw error;
  }
};

// Get wellness activities for a user
export const getWellnessActivities = async (userId: string, startDate?: string, endDate?: string) => {
  try {
    let query = supabase
      .from("wellness_activities")
      .select("*")
      .eq("user_id", userId);
    
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    
    if (endDate) {
      query = query.lte("created_at", endDate);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching wellness activities:", error);
    throw error;
  }
};

// Schedule a wellness reminder
export const scheduleWellnessReminder = async (userId: string, reminder: {
  title: string;
  description?: string;
  scheduled_for: string;
  recurrence?: "once" | "daily" | "weekly" | "monthly";
  notification_type: "app" | "email" | "both";
}) => {
  try {
    const { data, error } = await supabase
      .from("wellness_reminders")
      .insert({
        user_id: userId,
        ...reminder,
        created_at: new Date().toISOString(),
        active: true
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error scheduling wellness reminder:", error);
    throw error;
  }
};

// Get wellness reminders for a user
export const getWellnessReminders = async (userId: string, activeOnly: boolean = true) => {
  try {
    let query = supabase
      .from("wellness_reminders")
      .select("*")
      .eq("user_id", userId);
    
    if (activeOnly) {
      query = query.eq("active", true);
    }
    
    const { data, error } = await query.order("scheduled_for", { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching wellness reminders:", error);
    throw error;
  }
};

// Update or cancel a wellness reminder
export const updateWellnessReminder = async (reminderId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from("wellness_reminders")
      .update(updates)
      .eq("id", reminderId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error updating wellness reminder:", error);
    throw error;
  }
};

// Get wellness statistics (for charts and insights)
export const getWellnessStatistics = async (userId: string, period: "week" | "month" | "year" = "month") => {
  try {
    // Calculate the start date based on the period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    const startDateString = startDate.toISOString();
    
    // Get all activities in the period
    const { data: activities, error: activitiesError } = await supabase
      .from("wellness_activities")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startDateString)
      .order("created_at", { ascending: true });
    
    if (activitiesError) {
      throw activitiesError;
    }
    
    // Process the data for charts
    // This is a simple example - you'd likely want more sophisticated analytics in a real app
    const moodData = activities?.reduce((acc: Record<string, number>, activity) => {
      if (activity.mood) {
        acc[activity.mood] = (acc[activity.mood] || 0) + 1;
      }
      return acc;
    }, {});
    
    const activityTypeData = activities?.reduce((acc: Record<string, number>, activity) => {
      if (activity.type) {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Group activities by date for time-series data
    const timeSeriesData = activities?.reduce((acc: Record<string, any>, activity) => {
      // Get just the date part (without time)
      const date = activity.created_at.split('T')[0];
      
      if (!acc[date]) {
        acc[date] = {
          date,
          count: 0,
          activities: []
        };
      }
      
      acc[date].count += 1;
      acc[date].activities.push(activity);
      
      return acc;
    }, {});
    
    return {
      totalActivities: activities?.length || 0,
      moodDistribution: moodData,
      activityTypeDistribution: activityTypeData,
      timeSeriesData: Object.values(timeSeriesData || {}),
      rawData: activities
    };
  } catch (error) {
    console.error("Error getting wellness statistics:", error);
    throw error;
  }
};

// Get personalized wellness recommendations
export const getWellnessRecommendations = async (userId: string) => {
  try {
    // Get user's recent activities and interests to make recommendations
    const { data: activities, error: activitiesError } = await supabase
      .from("wellness_activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    
    if (activitiesError) {
      throw activitiesError;
    }
    
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("interests")
      .eq("id", userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }
    
    // Get general recommendations
    const { data: recommendations, error: recommendationsError } = await supabase
      .from("wellness_recommendations")
      .select("*")
      .limit(10);
    
    if (recommendationsError) {
      throw recommendationsError;
    }
    
    // Simple algorithm to score recommendations based on user interests and activity history
    // In a real app, this would be more sophisticated
    const scoredRecommendations = recommendations?.map(recommendation => {
      let score = 1; // Base score
      
      // Boost score based on user interests
      const userInterests = profile?.interests || [];
      if (recommendation.tags) {
        recommendation.tags.forEach((tag: string) => {
          if (userInterests.includes(tag)) {
            score += 2;
          }
        });
      }
      
      // Boost score based on activity history
      const activityTypes = activities?.map(a => a.type) || [];
      if (recommendation.activity_type && activityTypes.includes(recommendation.activity_type)) {
        score += 1;
      }
      
      return {
        ...recommendation,
        relevanceScore: score
      };
    });
    
    // Sort by relevance and return top recommendations
    return (scoredRecommendations || [])
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);
  } catch (error) {
    console.error("Error getting wellness recommendations:", error);
    throw error;
  }
};
