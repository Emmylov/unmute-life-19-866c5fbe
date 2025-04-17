
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PostFeed = () => {
  const { user } = useAuth();
  
  // Placeholder data for demonstration
  const posts = [
    {
      id: '1',
      username: 'mindfuluser',
      avatar: null,
      content: 'Just finished a 30-day meditation challenge! Feeling more centered and calm than ever.',
      likes: 24,
      comments: 5,
      timeAgo: '2h',
      hasImage: false
    },
    {
      id: '2',
      username: 'wellness_journey',
      avatar: null,
      content: 'Morning routine tip: Start with 5 minutes of deep breathing before checking your phone.',
      likes: 42,
      comments: 8,
      timeAgo: '5h',
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
    },
    {
      id: '3',
      username: 'peaceful_mind',
      avatar: null,
      content: 'Today I choose peace over perfection. What are you choosing today?',
      likes: 18,
      comments: 3,
      timeAgo: '1d',
      hasImage: false
    }
  ];

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No posts yet. Follow more users to see their content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <motion.div 
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {post.avatar ? (
                <img src={post.avatar} alt={post.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                post.username[0].toUpperCase()
              )}
            </div>
            <div>
              <p className="font-medium">{post.username}</p>
              <p className="text-xs text-gray-500">{post.timeAgo}</p>
            </div>
          </div>
          
          <p className="text-sm mb-3">{post.content}</p>
          
          {post.hasImage && (
            <div className="mb-3 rounded-lg overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt="Post content" 
                className="w-full h-auto object-cover"
                style={{ maxHeight: "300px" }}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between border-t border-b py-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PostFeed;
