
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LaunchBanner from '@/components/home/LaunchBanner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostFeed, StoriesBar, SuggestedUsers } from '@/components/home/DummyComponents';
import DailyReward from '@/components/rewards/DailyReward';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Home = () => {
  const { user, profile } = useAuth();
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  
  useEffect(() => {
    // Check if user should see daily reward
    const checkDailyReward = async () => {
      if (!user) return;
      
      try {
        const { data: userSettings } = await supabase
          .from('user_settings')
          .select('settings')
          .eq('user_id', user.id)
          .single();
          
        const settings = userSettings?.settings as Record<string, any> || {};
        
        // Safely access nested properties
        const rewardsSettings = settings.rewards as Record<string, any> || {};
        const lastClaimed = rewardsSettings.lastClaimed 
          ? new Date(rewardsSettings.lastClaimed)
          : null;
          
        const now = new Date();
        
        // If never claimed or claimed more than 20 hours ago, show dialog
        if (!lastClaimed || (now.getTime() - lastClaimed.getTime()) > 20 * 60 * 60 * 1000) {
          // Don't show immediately, wait a bit for better UX
          setTimeout(() => setShowRewardDialog(true), 2000);
        }
      } catch (error) {
        console.error("Error checking reward status:", error);
      }
    };
    
    checkDailyReward();
  }, [user]);

  return (
    <AppLayout pageTitle="Home">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <LaunchBanner />
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <StoriesBar />
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Feed</h2>
              <Link to="/create">
                <Button size="sm" className="unmute-primary-button">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Create
                </Button>
              </Link>
            </div>
            
            <PostFeed />
          </div>
          
          <div className="md:w-80 space-y-6">
            {profile && (
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.username || "Profile"} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold">
                        {(profile.username || "U")[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{profile.username || "User"}</h3>
                    <p className="text-sm text-gray-500">@{profile.username || "username"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center border-t border-b py-2 my-2">
                  <div>
                    <div className="font-bold">{profile.posts_count || 0}</div>
                    <div className="text-xs text-gray-500">Posts</div>
                  </div>
                  <div>
                    <div className="font-bold">{profile.followers || 0}</div>
                    <div className="text-xs text-gray-500">Followers</div>
                  </div>
                  <div>
                    <div className="font-bold">{profile.following || 0}</div>
                    <div className="text-xs text-gray-500">Following</div>
                  </div>
                </div>
                
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Profile
                  </Button>
                </Link>
              </div>
            )}
            
            <SuggestedUsers />
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium mb-2">Trending Topics</h3>
              <div className="space-y-2">
                {["#MentalHealth", "#SelfCare", "#Mindfulness", "#WellnessWednesday", "#DigitalDetox"].map((tag) => (
                  <div key={tag} className="text-sm">
                    <Link to={`/explore?tag=${tag.substring(1)}`} className="text-primary hover:underline">
                      {tag}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DailyReward onClose={() => setShowRewardDialog(false)} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Home;
