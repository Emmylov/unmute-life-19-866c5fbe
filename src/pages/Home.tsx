
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StoryBar />
          
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
        
        <div className="hidden lg:block">
          <SuggestedUsers />
          <TrendingTopics />
        </div>
      </div>
    </AppLayout>
  );
};

const StoryBar = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex overflow-x-auto space-x-4 py-2 -mx-2 px-2">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-unmute-purple to-unmute-pink p-[2px]">
            <button className="w-full h-full rounded-full flex items-center justify-center bg-white">
              <span className="text-xl">+</span>
            </button>
          </div>
          <span className="text-xs mt-1">Add</span>
        </div>
        
        {users.map((user) => (
          <div key={user.id} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-unmute-coral to-unmute-pink p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Avatar className="w-full h-full">
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <span className="text-xs mt-1 truncate w-16 text-center">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
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
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{post.user.username}</p>
            <p className="text-xs text-gray-500">{post.time}</p>
          </div>
        </div>
      </CardHeader>
      
      {post.image && (
        <div className="aspect-square bg-gray-100">
          <img src={post.image} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}
      
      <CardContent className="p-4">
        <p className="text-sm">{post.content}</p>
        
        {post.tags && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-red-500">
              <Heart className="h-5 w-5" />
            </Button>
            <span className="text-sm text-gray-500">{post.likes}</span>
            
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <span className="text-sm text-gray-500">{post.comments}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const SuggestedUsers = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Suggested for you</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.slice(0, 4).map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.username}</p>
                <p className="text-xs text-gray-500">Suggested for you</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-unmute-purple font-medium">
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const TrendingTopics = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Trending Topics</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {["climateaction", "mentalhealth", "techtrends", "creativity", "musiclife"].map((topic) => (
            <Badge key={topic} className="bg-unmute-purple/10 text-unmute-purple border-none hover:bg-unmute-purple/20">
              #{topic}
            </Badge>
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
