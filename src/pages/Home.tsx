
import React, { useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import HomeHeader from "@/components/home/HomeHeader";
import CreatePost from "@/components/home/CreatePost";
import PostCard from "@/components/home/PostCard";
import FilterBar from "@/components/home/FilterBar";
import HomeRightSidebar from "@/components/home/HomeRightSidebar";
import StoryFeed from "@/components/stories/StoryFeed";
import { getFeedPosts } from "@/services/post-service";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/shared/SEO";
import StoreSidebarItem from "@/components/store/StoreSidebarItem";

const Home = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

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

  return (
    <AppLayout>
      <SEO
        title="Unmute | Home Feed"
        description="See updates from your connections and communities on Unmute"
        canonicalUrl="https://unmutelife.online/home"
      />

      <StoreSidebarItem />

      <div className="flex flex-col-reverse md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <HomeHeader />
          <StoryFeed profile={profile} />
          <CreatePost />
          <FilterBar />
          
          {isLoading ? (
            // Loading skeletons
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 w-full">
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
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Follow more people or create your first post to get started!
              </p>
            </div>
          )}
        </div>
        
        <HomeRightSidebar />
      </div>
    </AppLayout>
  );
};

export default Home;
