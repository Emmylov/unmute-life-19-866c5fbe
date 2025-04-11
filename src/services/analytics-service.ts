
import { supabase } from "@/integrations/supabase/client";

// Track a user event
export const trackEvent = async (
  userId: string,
  event: {
    event_type: string;
    resource_id?: string;
    resource_type?: string;
    data?: any;
  }
) => {
  try {
    const { data, error } = await supabase
      .from("user_analytics")
      .insert({
        user_id: userId,
        event_type: event.event_type,
        resource_id: event.resource_id,
        resource_type: event.resource_type,
        data: event.data || {},
        created_at: new Date().toISOString()
      });
    
    if (error) {
      // Don't throw, just log the error
      // This ensures analytics errors don't disrupt the user experience
      console.error("Error tracking event:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error tracking event:", error);
    return null;
  }
};

// Get user activity statistics
export const getUserActivityStats = async (userId: string, period: "day" | "week" | "month" | "year" = "week") => {
  try {
    // Calculate the start date based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
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
    
    const startDateStr = startDate.toISOString();
    
    // Get all events for the user in the specified period
    const { data, error } = await supabase
      .from("user_analytics")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startDateStr)
      .order("created_at", { ascending: true });
    
    if (error) {
      throw error;
    }
    
    // Process data for visualizations
    // Group by event type
    const eventTypes = data?.reduce((acc: Record<string, number>, event) => {
      const type = event.event_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {}) || {};
    
    // Group by day for time series
    const eventsPerDay = data?.reduce((acc: Record<string, number>, event) => {
      const day = event.created_at.split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {}) || {};
    
    // Convert to arrays for charting libraries
    const eventTypesArray = Object.entries(eventTypes).map(([type, count]) => ({
      type,
      count
    }));
    
    const timeSeriesArray = Object.entries(eventsPerDay).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      totalEvents: data?.length || 0,
      eventsByType: eventTypesArray,
      eventTimeSeries: timeSeriesArray,
      rawData: data || []
    };
  } catch (error) {
    console.error("Error getting user activity stats:", error);
    throw error;
  }
};

// Get content performance metrics
export const getContentPerformanceMetrics = async (userId: string, contentType?: "images" | "text" | "reels") => {
  try {
    // Determine which tables to query based on contentType
    const tables: string[] = [];
    if (!contentType || contentType === "images") tables.push("posts_images");
    if (!contentType || contentType === "text") tables.push("posts_text");
    if (!contentType || contentType === "reels") tables.push("posts_reels");
    
    let results: any[] = [];
    
    // Query each table
    for (const table of tables) {
      // Get posts
      const { data: posts, error: postsError } = await supabase
        .from(table)
        .select("id, created_at")
        .eq("user_id", userId);
      
      if (postsError) throw postsError;
      if (!posts || posts.length === 0) continue;
      
      // Get engagement metrics for each post
      const postIds = posts.map(post => post.id);
      
      // Get comments
      const { data: comments, error: commentsError } = await supabase
        .from("post_comments")
        .select("post_id, count", { count: "exact", head: true })
        .in("post_id", postIds)
        .groupBy("post_id");
      
      if (commentsError && commentsError.code !== 'PGRST109') throw commentsError;
      
      // Get likes
      const { data: likes, error: likesError } = await supabase
        .from("post_likes")
        .select("post_id, count", { count: "exact", head: true })
        .in("post_id", postIds)
        .groupBy("post_id");
      
      if (likesError && likesError.code !== 'PGRST109') throw likesError;
      
      // Merge data
      for (const post of posts) {
        const commentCount = comments?.find(c => c.post_id === post.id)?.count || 0;
        const likeCount = likes?.find(l => l.post_id === post.id)?.count || 0;
        
        results.push({
          id: post.id,
          type: table.replace("posts_", ""),
          created_at: post.created_at,
          comments: commentCount,
          likes: likeCount,
          engagement: commentCount + likeCount
        });
      }
    }
    
    // Sort by date
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Calculate aggregate metrics
    const totalPosts = results.length;
    const totalComments = results.reduce((sum, post) => sum + post.comments, 0);
    const totalLikes = results.reduce((sum, post) => sum + post.likes, 0);
    const totalEngagement = totalComments + totalLikes;
    
    const avgCommentsPerPost = totalPosts ? totalComments / totalPosts : 0;
    const avgLikesPerPost = totalPosts ? totalLikes / totalPosts : 0;
    const avgEngagementPerPost = totalPosts ? totalEngagement / totalPosts : 0;
    
    // Group by content type
    const contentTypeBreakdown = results.reduce((acc: Record<string, any>, post) => {
      const type = post.type;
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          comments: 0,
          likes: 0,
          engagement: 0
        };
      }
      
      acc[type].count += 1;
      acc[type].comments += post.comments;
      acc[type].likes += post.likes;
      acc[type].engagement += post.engagement;
      
      return acc;
    }, {});
    
    return {
      totalPosts,
      totalComments,
      totalLikes,
      totalEngagement,
      avgCommentsPerPost,
      avgLikesPerPost,
      avgEngagementPerPost,
      contentTypeBreakdown,
      posts: results
    };
  } catch (error) {
    console.error("Error getting content performance metrics:", error);
    throw error;
  }
};

// Track mood and wellness statistics
export const getMoodStatistics = async (userId: string, period: "week" | "month" | "year" = "month") => {
  try {
    // Calculate the start date based on period
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
    
    const startDateStr = startDate.toISOString();
    
    // First check if wellness_activities table exists
    let moodData: any[] = [];
    
    try {
      // Get mood data from wellness activities
      const { data: activities, error: activitiesError } = await supabase
        .from("wellness_activities")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", startDateStr)
        .order("created_at", { ascending: true });
      
      if (!activitiesError) {
        moodData = activities || [];
      }
    } catch (error) {
      console.log("Wellness activities table might not exist yet");
    }
    
    // Try to get mood data from story posts too
    const { data: stories, error: storiesError } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", userId)
      .not("mood", "is", null)
      .gte("created_at", startDateStr)
      .order("created_at", { ascending: true });
    
    if (!storiesError && stories) {
      // Map story mood data to the same format as wellness activities
      const storyMoodData = stories.map(story => ({
        id: story.id,
        user_id: story.user_id,
        created_at: story.created_at,
        mood: story.mood,
        type: "story"
      }));
      
      moodData = [...moodData, ...storyMoodData];
    }
    
    // Sort by date
    moodData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    // Group by day for time series
    const moodByDay = moodData.reduce((acc: Record<string, any[]>, entry) => {
      const day = entry.created_at.split('T')[0];
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(entry);
      return acc;
    }, {});
    
    // Prepare time series data 
    const timeSeriesData = Object.entries(moodByDay).map(([date, entries]) => {
      // For simplicity, just taking the last mood of the day
      // In a real app, you might want to calculate averages or provide more detail
      return {
        date,
        mood: entries[entries.length - 1].mood,
        entries: entries.length
      };
    });
    
    // Count mood frequencies
    const moodCounts = moodData.reduce((acc: Record<string, number>, entry) => {
      const mood = entry.mood;
      if (mood) {
        acc[mood] = (acc[mood] || 0) + 1;
      }
      return acc;
    }, {});
    
    return {
      totalEntries: moodData.length,
      moodCounts,
      timeSeriesData,
      rawData: moodData
    };
  } catch (error) {
    console.error("Error getting mood statistics:", error);
    throw error;
  }
};
