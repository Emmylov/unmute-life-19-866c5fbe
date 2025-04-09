import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Mic, Music, Sparkles, 
  Image as ImageIcon, Smile, Globe, 
  BookOpen, Pencil, UserPlus, Filter, HeartHandshake,
  PlusCircle, FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StoryFeed from "@/components/stories/StoryFeed";

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
  const [userGreeting, setUserGreeting] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [activeTab, setActiveTab] = useState("for-you");
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Generate a personalized greeting
  useEffect(() => {
    const hours = new Date().getHours();
    let greeting = "";
    
    if (hours < 12) {
      greeting = "Good morning";
    } else if (hours < 17) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }
    
    setUserGreeting(greeting);
  }, []);

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
          // Not logged in, redirect to landing page
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchPosts() {
      setLoadingPosts(true);
      try {
        // Fetch posts from the "posts" table
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
    }
    
    getUser();
    fetchPosts();
  }, [navigate]);

  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!newPostText.trim()) {
      toast({
        title: "Empty post",
        description: "Please add some content to your post",
        variant: "destructive",
      });
      return;
    }

    setLoadingPosts(true);
    
    try {
      // Create post record
      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content: newPostText,
      });
      
      if (error) throw error;
      
      // Reset form
      setNewPostText("");
      
      // Show success toast
      toast({
        title: "Post created!",
        description: "Your post has been published successfully",
      });

      // Refresh posts
      const { data } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id(username, avatar, full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (data) {
        setPosts(data);
      }
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
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
        className="grid grid-cols-1 lg:grid-cols-3 gap-6" 
        initial="hidden" 
        animate="visible"
        variants={staggerItems}
      >
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Banner */}
          <motion.div 
            className="bg-dream-mist rounded-xl p-5 hidden md:block border border-white/40 shadow-sm"
            variants={fadeIn}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-medium">
                  {userGreeting}, {profile?.full_name || profile?.username || "there"}! 👋
                </h2>
                <p className="text-gray-600">Ready to unmute your world today?</p>
              </div>
              <div>
                <Button 
                  className="bg-cosmic-crush hover:bg-cosmic-crush/90 text-white border-none shadow-md"
                  onClick={() => navigate('/create')}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Record a Reel
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Create Post */}
          <motion.div 
            variants={fadeIn} 
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
          >
            <div className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-white">
                  <AvatarImage src={profile?.avatar || ''} />
                  <AvatarFallback className="bg-primary text-white">
                    {profile?.username?.[0]?.toUpperCase() || profile?.full_name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    placeholder="What's on your mind?"
                    className="bg-gray-50/80 border-none focus-visible:ring-primary/30 rounded-full"
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 border-t pt-3">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 flex items-center gap-1 hover:bg-gray-50 hover:text-primary"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Photo</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 flex items-center gap-1 hover:bg-gray-50 hover:text-primary"
                  >
                    <Smile className="h-4 w-4" />
                    <span>Mood</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 flex items-center gap-1 hover:bg-gray-50 hover:text-primary"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Public</span>
                  </Button>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-sm hover:shadow"
                  size="sm"
                  onClick={handleCreatePost}
                  disabled={loadingPosts}
                >
                  {loadingPosts ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Stories Feed */}
          <motion.div 
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
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
        
        <div className="hidden lg:flex lg:flex-col space-y-6">
          <WelcomeCard profile={profile} />
          <SuggestedUsers />
          <TrendingTopics />
        </div>
      </motion.div>
    </AppLayout>
  );
};

const WelcomeCard = ({ profile }: { profile: any }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="bg-dream-mist rounded-xl p-6 shadow-sm border border-white/40"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="font-semibold text-lg mb-2">Welcome to Unmute!</h3>
      <p className="text-sm text-gray-600 mb-4">
        This is your feed. Discover voices that matter to you.
      </p>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="rounded-full text-primary border-primary/20"
          onClick={() => navigate("/explore")}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Explore
        </Button>
        <Button 
          size="sm" 
          className="bg-cosmic-crush hover:bg-cosmic-crush/90 rounded-full text-white"
          onClick={() => navigate("/profile")}
        >
          Complete Profile
        </Button>
      </div>
    </motion.div>
  );
};

const SuggestedUsers = () => {
  return (
    <Card className="mb-6 shadow-sm border-none overflow-hidden rounded-xl">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Suggested for you</h3>
        
        <div className="empty-state bg-dream-mist py-6 px-4 rounded-lg">
          <div className="flex justify-center mb-3">
            <UserPlus className="h-8 w-8 text-primary/40" />
          </div>
          <p className="text-center text-sm text-gray-500">
            We're looking for people you might like to follow
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const TrendingTopics = () => {
  return (
    <Card className="shadow-sm border-none overflow-hidden rounded-xl">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Trending Topics</h3>
        <div className="flex flex-wrap gap-2">
          {["#climateaction", "#mentalhealth", "#techtrends", "#creativity", "#musiclife"].map((topic) => (
            <div 
              key={topic} 
              className="bg-dream-mist px-3 py-1.5 rounded-full text-xs font-medium text-primary/80 cursor-pointer hover:bg-primary/10 transition-colors"
            >
              {topic}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Home;
