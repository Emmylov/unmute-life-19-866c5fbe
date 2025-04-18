
import React, { useEffect, useState } from 'react';
import AppLayout from "@/components/layout/AppLayout";
import HomeHeader from "@/components/home/HomeHeader";
import MoodSelector from "@/components/home/MoodSelector";
import PostCard from "@/components/home/PostCard";
import HomeRightSidebar from "@/components/home/HomeRightSidebar";
import HomeGreeting from "@/components/home/HomeGreeting";
import DailyRewardButton from "@/components/home/DailyRewardButton";
import DailyRewardModal from "@/components/rewards/DailyRewardModal";
import { useFeed } from "@/hooks/feed";
import StoriesBar from '@/components/stories/StoriesBar';
import CreatePost from '@/components/home/CreatePost';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-responsive';
import { toast } from "sonner";

// Ensure Post type has the required content property
type Post = {
  id: string | number;
  content?: string;
  body?: string; // For posts_text
  created_at: string;
  user_id?: string;
  // Additional properties
  author?: string;
  username?: string;
  avatar?: string;
  date?: string;
  likes?: number;
  comments?: number;
  mood?: string;
  image_url?: string;
  image_urls?: string[];
  emoji_mood?: string;
  profiles?: {
    username?: string;
    avatar?: string;
    full_name?: string;
  };
};

const Home = () => {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const { posts, loading, refresh } = useFeed({ limit: 20 });
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();
  
  const handleMoodSelect = (mood: string) => {
    toast.success(`Mood set to: ${mood}`);
  };

  const handlePostCreated = () => {
    refresh();
    toast.success("Post created successfully!");
  };

  // Map the fetched posts to ensure they have the content property
  const mappedPosts = posts?.map(post => {
    // Ensure post has content property (use body field from posts_text if available or empty string as fallback)
    const postWithContent = {
      ...post,
      content: post.content || post.body || ''
    };
    return postWithContent as Post;
  });

  // Mock profile data for HomeRightSidebar if real profile isn't available
  const profileData = profile || {
    username: "user",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    name: "User",
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 space-y-3">
          {!isMobile && (
            <div className="flex justify-between items-center px-4">
              <HomeGreeting />
              <DailyRewardButton onClick={() => setShowRewardModal(true)} />
            </div>
          )}
          
          <div className="space-y-4">
            <StoriesBar />
            <HomeHeader />
            <div className="px-4">
              <MoodSelector onSelect={handleMoodSelect} />
            </div>
            
            {user && profile && (
              <div className="px-4">
                <CreatePost profile={profile} onPostCreated={handlePostCreated} />
              </div>
            )}

            <div className="space-y-3 px-4">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-100 h-48 animate-pulse rounded-xl"></div>
                  ))}
                </div>
              ) : mappedPosts && mappedPosts.length > 0 ? (
                mappedPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="bg-white p-6 rounded-xl text-center">
                  <h3 className="text-lg font-medium">No posts yet</h3>
                  <p className="text-gray-500 mt-2">Follow some users to see their posts here, or create your first post!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {!isMobile && (
          <div className="lg:col-span-4 px-4">
            <HomeRightSidebar profile={profileData} />
          </div>
        )}
      </div>
      
      <DailyRewardModal open={showRewardModal} onOpenChange={setShowRewardModal} />
    </AppLayout>
  );
};

export default Home;
