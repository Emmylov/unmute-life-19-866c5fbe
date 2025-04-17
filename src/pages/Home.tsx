
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
import { toast } from "sonner";

const Home = () => {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const { posts, loading, refresh } = useFeed({ limit: 20 });
  const { user, profile } = useAuth();
  
  const handleMoodSelect = (mood: string) => {
    toast.success(`Mood set to: ${mood}`);
  };

  const handlePostCreated = () => {
    refresh();
    toast.success("Post created successfully!");
  };

  // Mock profile data for HomeRightSidebar if real profile isn't available
  const profileData = profile || {
    username: "user",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    name: "User",
  };

  return (
    <AppLayout pageTitle="Home">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-3 sm:px-4">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <HomeGreeting />
            <DailyRewardButton onClick={() => setShowRewardModal(true)} />
          </div>
          
          <StoriesBar />
          <HomeHeader />
          <MoodSelector onSelect={handleMoodSelect} />
          
          {user && profile && (
            <CreatePost profile={profile} onPostCreated={handlePostCreated} />
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 h-64 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="bg-white p-6 rounded-xl text-center">
              <h3 className="text-lg font-medium">No posts yet</h3>
              <p className="text-gray-500 mt-2">Follow some users to see their posts here, or create your first post!</p>
            </div>
          )}
        </div>
        
        <HomeRightSidebar profile={profileData} />
      </div>
      
      <DailyRewardModal open={showRewardModal} onOpenChange={setShowRewardModal} />
    </AppLayout>
  );
};

export default Home;
