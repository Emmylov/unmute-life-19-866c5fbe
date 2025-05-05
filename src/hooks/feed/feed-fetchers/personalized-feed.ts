
import { supabase } from "@/integrations/supabase/client";
import { FeedPost } from "@/types/feed-post";
import { adaptToFeedPost } from "./utils";
import { PostType } from "@/services/content-service";

export const fetchPersonalizedFeed = async (lastId?: string | null): Promise<FeedPost[]> => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Fetch posts from separate tables since 'posts' table doesn't exist
    // Get text posts
    let textPostsQuery = supabase
      .from("text_posts")
      .select(`
        id,
        user_id,
        content,
        title,
        created_at,
        visibility,
        tags,
        emoji_mood,
        profiles (
          id,
          username,
          avatar,
          full_name
        )
      `)
      .eq("visibility", "public")
      .order("created_at", { ascending: false })
      .limit(10);

    if (lastId) {
      textPostsQuery = textPostsQuery.lt("id", lastId);
    }

    const { data: textPosts, error: textError } = await textPostsQuery;

    if (textError) {
      console.error("Error fetching text posts:", textError);
    }

    // Get image posts
    let imagePostsQuery = supabase
      .from("image_posts")
      .select(`
        id,
        user_id,
        image_urls,
        caption,
        created_at,
        visibility,
        tags,
        profiles (
          id,
          username,
          avatar,
          full_name
        )
      `)
      .eq("visibility", "public")
      .order("created_at", { ascending: false })
      .limit(10);

    if (lastId) {
      imagePostsQuery = imagePostsQuery.lt("id", lastId);
    }

    const { data: imagePosts, error: imageError } = await imagePostsQuery;

    if (imageError) {
      console.error("Error fetching image posts:", imageError);
    }

    // Get reel posts
    let reelPostsQuery = supabase
      .from("reel_posts")
      .select(`
        id,
        user_id,
        video_url,
        caption,
        thumbnail_url,
        created_at,
        visibility,
        tags,
        profiles (
          id,
          username,
          avatar,
          full_name
        )
      `)
      .eq("visibility", "public")
      .order("created_at", { ascending: false })
      .limit(10);

    if (lastId) {
      reelPostsQuery = reelPostsQuery.lt("id", lastId);
    }

    const { data: reelPosts, error: reelError } = await reelPostsQuery;

    if (reelError) {
      console.error("Error fetching reel posts:", reelError);
    }

    // Combine and process the posts
    const allPosts = [
      ...(textPosts || []).map(post => ({ 
        ...post, 
        type: PostType.TEXT, 
        post_type: "text" 
      })),
      ...(imagePosts || []).map(post => ({ 
        ...post, 
        type: PostType.IMAGE, 
        post_type: "image" 
      })),
      ...(reelPosts || []).map(post => ({ 
        ...post, 
        type: PostType.REEL, 
        post_type: "reel" 
      }))
    ];

    // Sort by created_at
    allPosts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Limit to 10 posts total
    const limitedPosts = allPosts.slice(0, 10);

    // Transform the data to match the FeedPost type
    const feedPosts: FeedPost[] = limitedPosts.map(post => adaptToFeedPost(post));

    return feedPosts;
  } catch (error) {
    console.error("Error fetching personalized feed:", error);
    throw error;
  }
};
