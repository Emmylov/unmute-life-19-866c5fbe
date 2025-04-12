
import { supabase } from "@/integrations/supabase/client";

export const searchUsers = async (query: string, limit: number = 20) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

export const searchContent = async (query: string, options: { contentType?: 'images' | 'text' | 'reels' | 'all', limit?: number } = {}) => {
  const { contentType = 'all', limit = 20 } = options;
  
  try {
    // Define result structure
    const result = {
      items: [] as any[],
      total: 0
    };
    
    // If contentType is 'all', search in all content types
    if (contentType === 'all') {
      const [imageResults, textResults, reelResults] = await Promise.all([
        searchContentByType(query, 'images', limit),
        searchContentByType(query, 'text', limit),
        searchContentByType(query, 'reels', limit)
      ]);
      
      result.items = [
        ...imageResults.map(item => ({ ...item, content_type: 'image' })),
        ...textResults.map(item => ({ ...item, content_type: 'text' })),
        ...reelResults.map(item => ({ ...item, content_type: 'reel' }))
      ];
      
      result.total = result.items.length;
      
      // Sort by creation date
      result.items.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      // Limit results
      result.items = result.items.slice(0, limit);
    } else {
      // Search in specific content type
      const items = await searchContentByType(query, contentType, limit);
      result.items = items.map(item => ({ ...item, content_type: contentType }));
      result.total = items.length;
    }
    
    return result;
  } catch (error) {
    console.error(`Error searching ${contentType || 'content'}:`, error);
    return { items: [], total: 0 };
  }
};

// Helper function to search content by type
const searchContentByType = async (query: string, contentType: 'images' | 'text' | 'reels', limit: number = 20) => {
  try {
    // Determine which table to query based on type
    let table = '';
    switch (contentType) {
      case 'images':
        table = 'posts_images';
        break;
      case 'text':
        table = 'posts_text';
        break;
      case 'reels':
        table = 'posts_reels';
        break;
      default:
        throw new Error(`Invalid content type: ${contentType}`);
    }
    
    // For text posts, search in title and body
    if (table === 'posts_text') {
      const { data, error } = await supabase
        .from(table as any)
        .select('*, profiles(*)')
        .or(`title.ilike.%${query}%,body.ilike.%${query}%`)
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    }
    
    // For images and reels, search in caption and tags
    const { data, error } = await supabase
      .from(table as any)
      .select('*, profiles(*)')
      .or(`caption.ilike.%${query}%`)
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error searching ${contentType}:`, error);
    return [];
  }
};

// This is a mock function - in a real scenario, you would need to create a communities table
export const searchCommunities = async (query: string, limit: number = 20) => {
  // Placeholder for future implementation
  return [];
};
