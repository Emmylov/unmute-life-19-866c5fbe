
import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Smile, Users, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreatePostProps {
  profile: any;
  onPostCreated: () => void;
}

const CreatePost = ({ profile, onPostCreated }: CreatePostProps) => {
  const [newPostText, setNewPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleCreatePost = async () => {
    if (!newPostText.trim()) {
      toast({
        title: "Empty post",
        description: "Please add some content to your post",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.from('posts').insert({
        user_id: profile.id,
        content: newPostText,
      });
      
      if (error) throw error;
      
      setNewPostText("");
      onPostCreated();
      
      toast({
        title: "Post created!",
        description: "Your post has been published successfully",
      });
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-4">
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
      
      <div className="flex items-center justify-between mt-3 border-t pt-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 flex items-center gap-1 hover:bg-gray-50 hover:text-primary shrink-0"
          >
            <ImageIcon className="h-4 w-4" />
            <span>Photo</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 flex items-center gap-1 hover:bg-gray-50 hover:text-primary shrink-0"
          >
            <Smile className="h-4 w-4" />
            <span>Mood</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 flex items-center gap-1 hover:bg-gray-50 hover:text-primary shrink-0"
            onClick={() => navigate('/create-collab')}
          >
            <Users className="h-4 w-4" />
            <span>Collab</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 flex items-center gap-1 hover:bg-gray-50 hover:text-primary shrink-0"
          >
            <Globe className="h-4 w-4" />
            <span>Public</span>
          </Button>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-sm hover:shadow"
          size="sm"
          onClick={handleCreatePost}
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
