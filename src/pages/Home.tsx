
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { 
  Heart, MessageCircle, Share2, Bookmark, Music, Sparkles, 
  Mic, ChevronDown, Image as ImageIcon, Smile, Plus, Globe, 
  Heart as HeartIcon, Trash2, ThumbsUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
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
  const [newPostText, setNewPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState("");
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [activeTab, setActiveTab] = useState("for-you");
  const [showConfetti, setShowConfetti] = useState(false);

  // Animation for confetti
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

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

  // Check if user is logged in
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
    getUser();
  }, [navigate]);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setSelectedImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedImagePreview("");
  };

  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!newPostText.trim() && !selectedImage) {
      toast({
        title: "Empty post",
        description: "Please add some text or an image to your post",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingPosts(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (selectedImage) {
        const filename = `${Date.now()}-${selectedImage.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(`public/${user.id}/${filename}`, selectedImage);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(`public/${user.id}/${filename}`);
          
        imageUrl = publicUrl;
      }
      
      // Create post record
      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content: newPostText,
        image_url: imageUrl,
      });
      
      if (error) throw error;
      
      // Reset form
      setNewPostText("");
      setSelectedImage(null);
      setSelectedImagePreview("");
      
      // Show success toast
      toast({
        title: "Post created!",
        description: "Your post has been published successfully",
      });

      // Trigger confetti animation for first post
      setShowConfetti(true);
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPosts(false);
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
                  className="w-3 h-3 bg-unmute-purple rounded-full animate-bounce" 
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
          {/* Welcome / Weather Banner */}
          <motion.div 
            className="bg-gradient-to-r from-unmute-purple/10 to-unmute-pink/10 rounded-xl p-5 hidden md:block"
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
                <Button className="bg-gradient-to-r from-unmute-purple to-unmute-pink hover:from-unmute-purple/90 hover:to-unmute-pink/90 text-white border-none">
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
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar || ''} />
                  <AvatarFallback className="bg-unmute-purple text-white">
                    {profile?.username?.[0]?.toUpperCase() || profile?.full_name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    placeholder="What's on your mind?"
                    className="bg-gray-50 border-none focus-visible:ring-unmute-purple/30"
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Image preview */}
              {selectedImagePreview && (
                <div className="mt-3 relative">
                  <img 
                    src={selectedImagePreview} 
                    alt="Preview" 
                    className="max-h-60 rounded-lg w-auto mx-auto"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4 border-t pt-3">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 flex items-center gap-1"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Photo</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 flex items-center gap-1">
                    <Smile className="h-4 w-4" />
                    <span>Mood</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>Public</span>
                  </Button>
                </div>
                <Button
                  className="bg-unmute-purple hover:bg-unmute-purple/90 text-white"
                  size="sm"
                  onClick={handleCreatePost}
                  disabled={isLoadingPosts}
                >
                  {isLoadingPosts ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </motion.div>
          
          <StoryBar />
          
          <FilterBar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <Post post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="hidden lg:flex lg:flex-col space-y-6">
          <WelcomeCard profile={profile} />
          <SuggestedUsers />
          <TrendingTopics />
        </div>
      </motion.div>

      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* This would be connected to a canvas confetti library */}
          <div className="confetti-animation"></div>
        </div>
      )}
    </AppLayout>
  );
};

const StoryBar = () => {
  return (
    <motion.div 
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex overflow-x-auto space-x-4 py-2 -mx-2 px-2 scrollbar-hide">
        <motion.div 
          className="flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-unmute-purple to-unmute-pink p-[2px]">
            <button className="w-full h-full rounded-full flex items-center justify-center bg-white">
              <Plus className="h-5 w-5 text-unmute-purple" />
            </button>
          </div>
          <span className="text-xs mt-1 font-medium">New Story</span>
        </motion.div>
        
        {users.map((user) => (
          <motion.div 
            key={user.id} 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-unmute-coral to-unmute-pink p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Avatar className="w-full h-full">
                  <AvatarImage src={`https://source.unsplash.com/random/100x100/?portrait&${user.id}`} />
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <span className="text-xs mt-1 truncate w-16 text-center font-medium">{user.username}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

interface FilterBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FilterBar = ({ activeTab, setActiveTab }: FilterBarProps) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-3 shadow-sm flex items-center space-x-2 overflow-x-auto scrollbar-hide border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger 
            value="for-you" 
            className={`${
              activeTab === 'for-you' 
                ? 'bg-white text-unmute-purple shadow-sm' 
                : 'bg-transparent text-gray-600'
            } border-none px-4 py-1.5 rounded-full`}
          >
            For You
          </TabsTrigger>
          <TabsTrigger 
            value="following" 
            className={`${
              activeTab === 'following' 
                ? 'bg-white text-unmute-purple shadow-sm' 
                : 'bg-transparent text-gray-600'
            } border-none px-4 py-1.5 rounded-full`}
          >
            Following
          </TabsTrigger>
          <TabsTrigger 
            value="music" 
            className={`${
              activeTab === 'music' 
                ? 'bg-white text-unmute-purple shadow-sm' 
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
                ? 'bg-white text-unmute-purple shadow-sm' 
                : 'bg-transparent text-gray-600'
            } border-none px-4 py-1.5 rounded-full`}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Trending
          </TabsTrigger>
          <TabsTrigger 
            value="podcasts" 
            className={`${
              activeTab === 'podcasts' 
                ? 'bg-white text-unmute-purple shadow-sm' 
                : 'bg-transparent text-gray-600'
            } border-none px-4 py-1.5 rounded-full`}
          >
            <Mic className="h-3.5 w-3.5 mr-1" />
            Podcasts
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </motion.div>
  );
};

interface PostProps {
  post: {
    id: number;
    user: {
      id: number;
      username: string;
      avatar?: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    time: string;
    tags?: string[];
  };
}

const Post = ({ post }: PostProps) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showReactionMenu, setShowReactionMenu] = useState(false);

  const reactions = ["❤️", "🔥", "🎉", "👏", "😮", "😥"];

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction);
    setShowReactionMenu(false);
    setIsLiked(true);
    if (!isLiked) {
      setLikeCount(prev => prev + 1);
    }
    
    // Show reaction animation
    const heart = document.createElement("div");
    heart.className = "heart-animation";
    heart.textContent = reaction;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
    
    toast({
      title: "Post reaction!",
      description: `You reacted with ${reaction}`,
      duration: 2000,
    });
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      setSelectedReaction(null);
    } else {
      setLikeCount(prev => prev + 1);
      setSelectedReaction("❤️");
      
      // Show heart animation
      const heart = document.createElement("div");
      heart.className = "heart-animation";
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
      
      toast({
        title: "Post liked!",
        description: "You liked this post.",
        duration: 2000,
      });
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Post removed from saved" : "Post saved!",
      description: isSaved ? "This post has been removed from your saved items." : "You can find this post in your saved items.",
      duration: 2000,
    });
  };

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`https://source.unsplash.com/random/100x100/?portrait&${post.user.id}`} />
              <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{post.user.username}</p>
              <p className="text-xs text-gray-500">{post.time}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm mb-4">{post.content}</p>
        
        {post.image && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
            <img 
              src={post.image} 
              alt="Post" 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        
        {post.tags && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <motion.div
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge variant="secondary" className="bg-unmute-purple/10 text-unmute-purple border-none hover:bg-unmute-purple/20">
                  #{tag}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`${selectedReaction ? "text-unmute-purple" : "text-gray-500"}`}
                  onClick={() => setShowReactionMenu(!showReactionMenu)}
                >
                  {selectedReaction ? (
                    <span className="text-lg">{selectedReaction}</span>
                  ) : (
                    <Heart className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
              
              {/* Reaction Menu */}
              <AnimatePresence>
                {showReactionMenu && (
                  <motion.div 
                    className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-1.5 flex space-x-2"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {reactions.map(reaction => (
                      <motion.button
                        key={reaction}
                        className="text-lg hover:scale-125 transition-transform"
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReaction(reaction)}
                      >
                        {reaction}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className="text-sm text-gray-500">{likeCount}</span>
            
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-500"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </motion.div>
            <span className="text-sm text-gray-500">{post.comments}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-500"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className={`${isSaved ? "text-unmute-purple" : "text-gray-500"}`}
                onClick={handleSave}
              >
                <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
              </Button>
            </motion.div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const WelcomeCard = ({ profile }: { profile: any }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10 rounded-xl p-6 shadow-sm"
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
          className="rounded-full text-unmute-purple"
          onClick={() => navigate("/explore")}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Explore
        </Button>
        <Button 
          size="sm" 
          className="bg-unmute-purple hover:bg-unmute-purple/90 rounded-full text-white"
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
    <Card className="mb-6 shadow-sm border-none">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Suggested for you</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.slice(0, 4).map((user) => (
          <motion.div 
            key={user.id} 
            className="flex items-center justify-between"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.01)", borderRadius: "8px" }}
          >
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={`https://source.unsplash.com/random/100x100/?portrait&${user.id}`} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.username}</p>
                <p className="text-xs text-gray-500">Suggested for you</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-unmute-purple font-medium hover:bg-unmute-purple/10"
            >
              Follow
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

const TrendingTopics = () => {
  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Trending Topics</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {["climateaction", "mentalhealth", "techtrends", "creativity", "musiclife"].map((topic, index) => (
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge className="bg-unmute-purple/10 text-unmute-purple border-none hover:bg-unmute-purple/20">
                #{topic}
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Sample data
const users = [
  { id: 1, username: "maya_creative" },
  { id: 2, username: "techrebel" },
  { id: 3, username: "greenearth" },
  { id: 4, username: "musiclover" },
  { id: 5, username: "artistry" },
  { id: 6, username: "mindfulme" },
];

const posts = [
  {
    id: 1,
    user: { id: 1, username: "maya_creative" },
    content: "Just finished this new painting! What do you all think? #art #creativity",
    image: "https://source.unsplash.com/random/1080x1080/?painting",
    likes: 124,
    comments: 18,
    time: "2 hours ago",
    tags: ["art", "creativity", "painting"]
  },
  {
    id: 2,
    user: { id: 2, username: "techrebel" },
    content: "The future of AI is both exciting and challenging. We need more young voices in this conversation! Who's with me?",
    likes: 89,
    comments: 32,
    time: "5 hours ago",
    tags: ["tech", "ai", "future"]
  },
  {
    id: 3,
    user: { id: 3, username: "greenearth" },
    content: "Today's beach cleanup was a huge success! Thanks to everyone who came out to help. Together we collected over 50 bags of trash! 🌊🌍",
    image: "https://source.unsplash.com/random/1080x1080/?beach,cleanup",
    likes: 203,
    comments: 45,
    time: "1 day ago",
    tags: ["climateaction", "beachcleanup", "environment"]
  }
];

export default Home;
