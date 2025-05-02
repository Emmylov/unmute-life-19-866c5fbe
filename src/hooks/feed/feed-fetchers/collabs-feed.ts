
import { supabase } from "@/integrations/supabase/client";
import { FeedPost } from "@/services/post-service";

export interface CollaborationPost extends FeedPost {
  collaboration_type?: string;
  collaborators?: string[];
}

export async function fetchCollaborativePosts(userId: string): Promise<CollaborationPost[]> {
  try {
    // Fetch posts that are collaborations first
    const collaborationPosts: CollaborationPost[] = [];
    
    // Fetch image collaborations - add collaboration fields if needed
    let { data: imageCollabs, error: imageColabsError } = await supabase
      .from('image_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });
    
    if (imageColabsError) {
      console.error("Error fetching image collaborations:", imageColabsError);
    }
    
    // Fetch text collaborations
    let { data: textCollabs, error: textColabsError } = await supabase
      .from('text_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });
    
    if (textColabsError) {
      console.error("Error fetching text collaborations:", textColabsError);
    }
    
    // Fetch reel collaborations
    let { data: reelCollabs, error: reelColabsError } = await supabase
      .from('reel_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });
    
    if (reelColabsError) {
      console.error("Error fetching reel collaborations:", reelColabsError);
    }
    
    // Transform image collaborations to FeedPost format
    if (imageCollabs) {
      const formattedPosts = imageCollabs.map(post => ({
        id: post.id,
        user_id: post.user_id,
        content: null,
        title: null,
        image_urls: post.image_urls,
        video_url: null,
        caption: post.caption,
        tags: post.tags,
        emoji_mood: null,
        post_type: 'image' as const,
        created_at: post.created_at,
        visibility: post.visibility,
        likes_count: 0,
        comments_count: 0,
        profiles: post.profiles,
        // Optional collaboration fields can be added here if needed
        collaboration_type: 'direct',
        collaborators: []
      }));
      
      collaborationPosts.push(...formattedPosts);
    }
    
    // Transform text collaborations to FeedPost format
    if (textCollabs) {
      const formattedPosts = textCollabs.map(post => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        title: post.title,
        image_urls: null,
        video_url: null,
        caption: null,
        tags: post.tags,
        emoji_mood: post.emoji_mood,
        post_type: 'text' as const,
        created_at: post.created_at,
        visibility: post.visibility,
        likes_count: 0,
        comments_count: 0,
        profiles: post.profiles,
        // Optional collaboration fields can be added here if needed
        collaboration_type: 'direct',
        collaborators: []
      }));
      
      collaborationPosts.push(...formattedPosts);
    }
    
    // Transform reel collaborations to FeedPost format
    if (reelCollabs) {
      const formattedPosts = reelCollabs.map(post => ({
        id: post.id,
        user_id: post.user_id,
        content: null,
        title: null,
        image_urls: null,
        video_url: post.video_url,
        caption: post.caption,
        tags: post.tags,
        emoji_mood: null,
        post_type: 'reel' as const,
        created_at: post.created_at,
        visibility: post.visibility,
        likes_count: 0,
        comments_count: 0,
        profiles: post.profiles,
        // Optional collaboration fields can be added here if needed
        collaboration_type: 'direct',
        collaborators: []
      }));
      
      collaborationPosts.push(...formattedPosts);
    }
    
    // Sort all posts by created_at
    return collaborationPosts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error("Error fetching collaborative posts:", error);
    return [];
  }
}
