
import { supabase } from "@/integrations/supabase/client";
import { FeedPost } from "@/types/feed-post";
import { adaptToFeedPost } from "./utils";

export const fetchTrendingFeed = async (lastId?: string | null): Promise<FeedPost[]> => {
  try {
    // Fetch trending posts - for simplicity, using most liked posts as trending
    let query = supabase
      .from("posts")
      .select(
        `
        id,
        user_id,
        post_type,
        content,
        title,
        image_urls,
        video_url,
        caption,
        thumbnail_url,
        emoji_mood,
        created_at,
        visibility,
        likes_count,
        comments_count,
        profiles (
          id,
          username,
          avatar,
          full_name
        ),
        tags
        `
      )
      .eq("visibility", "public")
      .order("likes_count", { ascending: false }) // Order by likes for trending
      .limit(10);

    // Add pagination if lastId is provided
    if (lastId) {
      query = query.lt("id", lastId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data to match the FeedPost type
    const feedPosts: FeedPost[] = data.map((post) => {
      return adaptToFeedPost(post);
    });

    return feedPosts;
  } catch (error) {
    console.error("Error fetching trending feed:", error);
    throw error;
  }
};
