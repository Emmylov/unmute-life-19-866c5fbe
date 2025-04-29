
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image as ImageIcon, Smile, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createTextPost } from "@/services/post-service";
import { toast } from "sonner";
import MoodSelector from "@/components/home/MoodSelector";
import { createUnifiedTextPost } from "@/services/unified-post-service";

interface CreatePostProps {
  profile: any;
  onPostCreated?: () => void;
}

const CreatePost = ({ profile, onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const [postText, setPostText] = useState("");
  const [moodEmoji, setMoodEmoji] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  
  const handleCreatePost = async () => {
    if (!user) {
      toast.error("Please sign in to create a post");
      return;
    }
    
    if (!postText.trim()) {
      toast.error("Post cannot be empty");
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Try to use the unified_posts table first
      try {
        await createUnifiedTextPost(user.id, postText.trim(), undefined, undefined, moodEmoji || undefined);
        
        // Clear form
        setPostText("");
        setMoodEmoji("");
        
        // Notify parent component
        if (onPostCreated) {
          onPostCreated();
        }
        
        return;
      } catch (unifiedError) {
        console.error("Error creating unified post:", unifiedError);
        // Fall back to legacy post creation
      }
      
      // Legacy post creation as fallback
      await createTextPost(user.id, postText.trim(), undefined, undefined, moodEmoji || undefined);
      
      setPostText("");
      setMoodEmoji("");
      
      // Notify parent component
      if (onPostCreated) {
        onPostCreated();
      }
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleMoodSelected = (emoji: string) => {
    setMoodEmoji(emoji);
    setShowMoodPicker(false);
  };
  
  return (
    <Card className="shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dream-mist/10 to-transparent pointer-events-none" />
      <CardContent className="p-4 relative">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar || ""} />
            <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <div className="relative">
              <textarea
                placeholder="What's on your mind?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="w-full min-h-[120px] focus:outline-none focus:ring-0 border rounded-lg p-3 pr-12 bg-white/80 backdrop-blur-sm"
                disabled={isCreating}
              />
              {moodEmoji && (
                <div className="absolute top-3 right-3 text-xl">
                  {moodEmoji}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost"
                >
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                </Button>
                
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost"
                  onClick={() => setShowMoodPicker(!showMoodPicker)}
                >
                  <Smile className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
              
              <Button 
                onClick={handleCreatePost} 
                disabled={!postText.trim() || isCreating}
                className="flex items-center gap-2"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : "Post"}
              </Button>
            </div>
            
            {showMoodPicker && (
              <MoodSelector 
                onSelect={handleMoodSelected}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
