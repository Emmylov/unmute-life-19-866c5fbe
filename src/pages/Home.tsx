
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark, Music, Sparkles, Mic, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StoryBar />
          
          <FilterBar />
          
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Post post={post} />
            </motion.div>
          ))}
        </div>
        
        <div className="hidden lg:block space-y-6">
          <WelcomeCard />
          <SuggestedUsers />
          <TrendingTopics />
        </div>
      </div>
    </AppLayout>
  );
};

const StoryBar = () => {
  return (
    <motion.div 
      className="bg-white rounded-xl p-4 shadow-sm"
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
              <span className="text-xl">+</span>
            </button>
          </div>
          <span className="text-xs mt-1">Add</span>
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
            <span className="text-xs mt-1 truncate w-16 text-center">{user.username}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const FilterBar = () => {
  return (
    <motion.div
      className="bg-white rounded-xl p-3 shadow-sm flex items-center space-x-2 overflow-x-auto scrollbar-hide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Badge variant="outline" className="bg-unmute-purple/10 text-unmute-purple border-none px-4 py-1.5 rounded-full">
        For You
      </Badge>
      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-none px-4 py-1.5 rounded-full hover:bg-gray-200">
        Following
      </Badge>
      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-none px-4 py-1.5 rounded-full hover:bg-gray-200">
        <Music className="h-3.5 w-3.5 mr-1" />
        Music
      </Badge>
      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-none px-4 py-1.5 rounded-full hover:bg-gray-200">
        <Sparkles className="h-3.5 w-3.5 mr-1" />
        Trending
      </Badge>
      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-none px-4 py-1.5 rounded-full hover:bg-gray-200">
        <Mic className="h-3.5 w-3.5 mr-1" />
        Podcasts
      </Badge>
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

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
      
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
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
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
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  #{tag}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className={`${isLiked ? "text-red-500" : "text-gray-500"}`}
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </motion.div>
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

const WelcomeCard = () => {
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
        <Button size="sm" variant="outline" className="rounded-full text-unmute-purple">
          <Sparkles className="h-4 w-4 mr-1" />
          Explore
        </Button>
        <Button size="sm" className="bg-unmute-purple hover:bg-unmute-purple/90 rounded-full text-white">
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
