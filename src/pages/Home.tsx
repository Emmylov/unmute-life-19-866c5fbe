import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import HomeHeader from "@/components/home/HomeHeader";
import CreatePost from "@/components/home/CreatePost";
import PostCard from "@/components/home/PostCard";
import FilterBar from "@/components/home/FilterBar";
import HomeRightSidebar from "@/components/home/HomeRightSidebar";
import StoryFeed from "@/components/stories/StoryFeed";
import HomeGreeting from "@/components/home/HomeGreeting";
import { getFeedPosts } from "@/services/post-service";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/shared/SEO";
import StoreSidebarItem from "@/components/store/StoreSidebarItem";
import { motion } from "framer-motion";

const Home = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = useState("for-you");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        if (user) {
          const fetchedPosts = await getFeedPosts(user.id);
          setPosts(fetchedPosts || []);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [user]);

  const handlePostCreated = () => {
    if (user) {
      getFeedPosts(user.id).then(fetchedPosts => {
        setPosts(fetchedPosts || []);
      }).catch(error => {
        console.error("Error refreshing posts:", error);
      });
    }
  };

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

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
              <h3 className="text-xl font-semibold mb-2 relative z-10">No Posts Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 relative z-10">
                Follow more people or create your first post to get started!
              </p>
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
