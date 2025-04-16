import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Sparkles, Filter, Users, PlusCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StoryFeed from "@/components/stories/StoryFeed";
import JournalingPrompt from "@/components/vibe-check/JournalingPrompt";
import CreatePost from "@/components/home/CreatePost";
import HomeRightSidebar from "@/components/home/HomeRightSidebar";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("for-you");
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Check if user is logged in and fetch posts
  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          
          // Fetch profile data
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (data && !error) {
            setProfile(data);
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    
    getUser();
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id(username, avatar, full_name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="space-y-3">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-3 h-3 bg-primary rounded-full animate-bounce" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p className="text-gray-500">Loading your personalized feed...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-4" 
        initial="hidden" 
        animate="visible"
        variants={staggerItems}
      >
        <div className="lg:col-span-2 space-y-4">
          {/* Daily Journaling Prompt */}
          <motion.div 
            variants={fadeIn}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <JournalingPrompt />
          </motion.div>
          
          {/* Create Post */}
          <motion.div variants={fadeIn}>
            <CreatePost profile={profile} onPostCreated={fetchPosts} />
          </motion.div>
          
          {/* Stories Feed */}
          <motion.div 
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StoryFeed profile={profile} />
          </motion.div>
          
          {/* Filter Bar */}
          <motion.div
            className="bg-white rounded-xl p-3 shadow-sm flex items-center space-x-2 overflow-x-auto scrollbar-hide border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-gray-100/80 p-1">
                <TabsTrigger 
                  value="for-you" 
                  className={`${
                    activeTab === 'for-you' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'bg-transparent text-gray-600'
                  } border-none px-4 py-1.5 rounded-full`}
                >
                  For You
                </TabsTrigger>
                <TabsTrigger 
                  value="following" 
                  className={`${
                    activeTab === 'following' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'bg-transparent text-gray-600'
                  } border-none px-4 py-1.5 rounded-full`}
                >
                  Following
                </TabsTrigger>
                <TabsTrigger 
                  value="music" 
                  className={`${
                    activeTab === 'music' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'bg-transparent text-gray-600'
                  } border-none px-4 py-1.5 rounded-full`}
                >
                  <Music className="h-3.5 w-3.5 mr-1" />
                  Music
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  className={`${
                    activeTab === 'trending' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'bg-transparent text-gray-600'
                  } border-none px-4 py-1.5 rounded-full`}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Trending
                </TabsTrigger>
                <TabsTrigger 
                  value="collabs" 
                  className={`${
                    activeTab === 'collabs' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'bg-transparent text-gray-600'
                  } border-none px-4 py-1.5 rounded-full`}
                >
                  <Users className="h-3.5 w-3.5 mr-1" />
                  Collabs
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="ghost" size="sm" className="shrink-0">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </motion.div>
          
          {/* Posts or Empty State */}
          {loadingPosts ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex gap-3 items-center mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/5"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                  {/* Post content here */}
                </Card>
              ))}
            </div>
          ) : (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="empty-state-icon">
                <FileText className="w-full h-full" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">Be the first to start a conversation!</p>
              <Button 
                className="bg-cosmic-crush hover:bg-cosmic-crush/90 text-white rounded-full shadow-md"
                onClick={() => navigate('/create')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create a Post
              </Button>
            </motion.div>
          )}
        </div>
        
        <HomeRightSidebar profile={profile} />
      </motion.div>
    </AppLayout>
  );
};

export default Home;
