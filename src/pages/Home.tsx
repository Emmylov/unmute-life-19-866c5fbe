import React, { useEffect, useState, useCallback } from "react";
import AppLayout from "@/components/layout/AppLayout";
import HomeHeader from "@/components/home/HomeHeader";
import CreatePost from "@/components/home/CreatePost";
import PostCard from "@/components/home/PostCard";
import FilterBar from "@/components/home/FilterBar";
import HomeRightSidebar from "@/components/home/HomeRightSidebar";
import StoryFeed from "@/components/stories/StoryFeed";
import HomeGreeting from "@/components/home/HomeGreeting";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/shared/SEO";
import StoreSidebarItem from "@/components/store/StoreSidebarItem";
import { motion } from "framer-motion";
import { useFeed, FeedType } from "@/hooks/feed/use-feed";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<FeedType>("personalized");
  const { t } = useTranslation();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Use our improved feed hook
  const { 
    posts, 
    loading: isLoading, 
    error, 
    refreshFeed, 
    networkError, 
    hasFetchedData 
  } = useFeed({
    type: activeTab,
    refreshTrigger
  });

  // Handle refresh after post creation
  const handlePostCreated = useCallback(() => {
    // Immediately refresh the feed when a post is created
    refreshFeed().then(() => {
      toast.success(t('common.success.postCreated', "Post created successfully!"));
    });
  }, [refreshFeed, t]);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue as FeedType);
  };

  // Display network error only once
  useEffect(() => {
    if (networkError) {
      toast.error(t('common.error.networkError', 'Network connection issue'), {
        description: t('common.error.tryAgainLater', 'Please check your connection and try again later')
      });
    }
  }, [networkError, t]);

  // Animation configurations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AppLayout>
      <SEO
        title="Unmute | Home Feed"
        description="See updates from your connections and communities on Unmute"
        canonicalUrl="https://unmutelife.online/home"
      />

      <StoreSidebarItem />

      <div className="flex flex-col-reverse md:flex-row gap-4 relative">
        <motion.div 
          className="flex-1 space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-dream-mist/30 to-transparent pointer-events-none" />
            <motion.div variants={item}>
              <HomeHeader />
            </motion.div>
          </div>

          <motion.div variants={item}>
            <HomeGreeting username={profile?.username} />
          </motion.div>

          <motion.div variants={item} className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-dream-mist/20 via-transparent to-dream-mist/20 pointer-events-none" />
            <StoryFeed profile={profile} />
          </motion.div>

          <motion.div variants={item}>
            <CreatePost profile={profile} onPostCreated={handlePostCreated} />
          </motion.div>

          <motion.div variants={item}>
            <FilterBar activeTab={activeTab} onTabChange={handleTabChange} />
          </motion.div>
          
          {isLoading ? (
            <motion.div variants={item} className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-dream-mist/5 to-transparent animate-shimmer" />
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                      <div className="h-3 w-1/5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  </div>
                  <div className="mt-4 h-60 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                </div>
              ))}
            </motion.div>
          ) : posts.length > 0 ? (
            <motion.div variants={item} className="space-y-4">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.01 }}
                  className="transform transition-all duration-300 hover:shadow-lg"
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              variants={item}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-dream-mist/30 to-transparent pointer-events-none" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">
                {hasFetchedData ? 'No Posts Yet' : 'Unable to load posts'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 relative z-10">
                {hasFetchedData ? 
                  'Follow more people or create your first post to get started!' :
                  'There was a problem loading your feed. Please try refreshing.'}
              </p>
              {!hasFetchedData && (
                <button 
                  onClick={() => refreshFeed()} 
                  className="mt-4 px-4 py-2 bg-unmute-purple text-white rounded-md hover:bg-unmute-purple/90 transition-colors"
                >
                  Try Again
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
        
        <div className="w-full md:w-80">
          <HomeRightSidebar profile={profile} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
