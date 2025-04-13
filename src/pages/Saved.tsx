
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Video, Image as ImageIcon, FileText, MoreHorizontal, Heart, MessageCircle, Link as LinkIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-responsive";
import { motion } from "framer-motion";

interface SavedItem {
  id: string;
  type: "post" | "reel" | "article";
  title?: string;
  content: string;
  image?: string;
  videoThumbnail?: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  savedAt: string;
  likes: number;
  comments: number;
  tags: string[];
}

const Saved = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("all");
  
  const savedItems: SavedItem[] = [
    {
      id: "1",
      type: "post",
      content: "Mental health isn't just about treating problems; it's about creating a life worth living. Celebrate small victories!",
      user: {
        name: "Sarah Johnson",
        username: "mindful_sarah",
        avatar: "/placeholder.svg"
      },
      savedAt: "2025-04-10T10:30:00",
      likes: 243,
      comments: 42,
      tags: ["MentalHealth", "SelfCare"]
    },
    {
      id: "2",
      type: "reel",
      videoThumbnail: "/placeholder.svg",
      content: "3 quick breathing exercises to help with anxiety",
      user: {
        name: "Wellness with Jamie",
        username: "wellness_jamie",
        avatar: "/placeholder.svg"
      },
      savedAt: "2025-04-09T14:15:00",
      likes: 1204,
      comments: 89,
      tags: ["Anxiety", "Breathing", "Wellness"]
    },
    {
      id: "3",
      type: "article",
      title: "Finding Your Voice: Expressing Yourself Authentically",
      content: "In a world full of noise, how do you make your voice heard without losing yourself?",
      image: "/placeholder.svg",
      user: {
        name: "Teen Voices Magazine",
        username: "teen_voices",
        avatar: "/placeholder.svg"
      },
      savedAt: "2025-04-08T09:45:00",
      likes: 532,
      comments: 67,
      tags: ["Authenticity", "SelfExpression"]
    },
    {
      id: "4",
      type: "post",
      content: "Remember that you're not alone in your struggles. Reaching out for help is a sign of strength, not weakness.",
      image: "/placeholder.svg",
      user: {
        name: "Support Network",
        username: "support_net",
        avatar: "/placeholder.svg"
      },
      savedAt: "2025-04-07T16:20:00",
      likes: 876,
      comments: 124,
      tags: ["Support", "MentalHealth"]
    },
    {
      id: "5",
      type: "reel",
      videoThumbnail: "/placeholder.svg",
      content: "How to start a conversation about mental health with friends",
      user: {
        name: "Teen Talk",
        username: "teen_talk",
        avatar: "/placeholder.svg"
      },
      savedAt: "2025-04-06T11:10:00",
      likes: 1543,
      comments: 201,
      tags: ["Conversations", "Friends", "Support"]
    }
  ];
  
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  const filteredItems = activeTab === "all" 
    ? savedItems 
    : savedItems.filter(item => item.type === activeTab);
  
  const getItemIcon = (type: string) => {
    switch(type) {
      case "post": 
        return <FileText className="h-4 w-4" />;
      case "reel": 
        return <Video className="h-4 w-4" />;
      case "article": 
        return <ImageIcon className="h-4 w-4" />;
      default: 
        return <Bookmark className="h-4 w-4" />;
    }
  };
  
  return (
    <AppLayout pageTitle="Saved">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Saved Items</h1>
            <p className="text-gray-600">Your personal collection of saved content</p>
          </div>
          
          <Button variant="outline" className="hidden md:flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Create Collection
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="rounded-full">All Items</TabsTrigger>
            <TabsTrigger value="post" className="rounded-full">Posts</TabsTrigger>
            <TabsTrigger value="reel" className="rounded-full">Reels</TabsTrigger>
            <TabsTrigger value="article" className="rounded-full">Articles</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={item.user.avatar} alt={item.user.name} />
                              <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <p className="font-medium text-sm">{item.user.name}</p>
                              <p className="text-xs text-gray-500">@{item.user.username}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {getItemIcon(item.type)}
                              <span className="capitalize">{item.type}</span>
                            </Badge>
                            
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="py-2">
                        {item.title && <h3 className="text-lg font-medium mb-2">{item.title}</h3>}
                        
                        {item.type === 'reel' && item.videoThumbnail && (
                          <div className="relative rounded-lg overflow-hidden mb-3 aspect-[9/16] max-h-[320px]">
                            <img 
                              src={item.videoThumbnail} 
                              alt="Video thumbnail" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                                <Video className="h-8 w-8 text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {item.type === 'article' && item.image && (
                          <div className="rounded-lg overflow-hidden mb-3">
                            <img 
                              src={item.image} 
                              alt="Article image" 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        
                        <p className="text-gray-800">{item.content}</p>
                        
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="flex justify-between pt-2 pb-3">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
                            <Heart className="h-4 w-4" />
                            <span>{item.likes}</span>
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
                            <MessageCircle className="h-4 w-4" />
                            <span>{item.comments}</span>
                          </Button>
                        </div>
                        
                        <div className="flex items-center">
                          <p className="text-xs text-gray-500">
                            Saved on {getFormattedDate(item.savedAt)}
                          </p>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-unmute-purple/10 rounded-full mb-4">
                  <Bookmark className="h-8 w-8 text-unmute-purple" />
                </div>
                <h3 className="text-xl font-medium mb-2">No saved items</h3>
                <p className="text-gray-600 max-w-md mb-6">
                  You haven't saved any {activeTab !== "all" ? activeTab + "s" : "items"} yet. Save content by clicking the bookmark icon on posts, reels, and articles.
                </p>
                <Button>Explore Content</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Saved;
