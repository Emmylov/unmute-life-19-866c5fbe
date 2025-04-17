
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Smile, Users, Globe, Lock, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { uploadImage } from "@/services/upload-service";

interface CreatePostProps {
  profile: any;
  onPostCreated: () => void;
}

const CreatePost = ({ profile, onPostCreated }: CreatePostProps) => {
  const [newPostText, setNewPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Mood selection options
  const moods = [
    { emoji: "😊", name: "Happy" },
    { emoji: "😴", name: "Tired" },
    { emoji: "😌", name: "Calm" },
    { emoji: "🤔", name: "Thoughtful" },
    { emoji: "😢", name: "Sad" },
    { emoji: "😤", name: "Frustrated" },
    { emoji: "🥳", name: "Excited" },
    { emoji: "😎", name: "Cool" },
  ];
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setPreviewImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleMoodSelect = (mood: string, emoji: string) => {
    setSelectedMood(`${emoji} ${mood}`);
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'friends': return <Users2 className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getVisibilityLabel = () => {
    switch (visibility) {
      case 'public': return "Public";
      case 'friends': return "Friends";
      case 'private': return "Only Me";
      default: return "Public";
    }
  };
  
  const handleCreatePost = async () => {
    if (!newPostText.trim() && !selectedImage) {
      toast.error("Please add some content to your post");
      return;
    }

    setLoading(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (selectedImage) {
        try {
          imageUrl = await uploadImage(selectedImage);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
      }
      
      // Determine which table to insert into based on content type
      if (imageUrl) {
        // Create an image post
        const { error } = await supabase.from('posts_images').insert({
          user_id: profile.id,
          image_urls: [imageUrl],
          caption: newPostText || null,
          visibility: visibility
        });
        
        if (error) throw error;
      } else {
        // Create a text post
        const { error } = await supabase.from('posts_text').insert({
          user_id: profile.id,
          body: newPostText,
          emoji_mood: selectedMood,
          visibility: visibility
        });
        
        if (error) throw error;
      }
      
      // Reset form
      setNewPostText("");
      setSelectedMood(null);
      setSelectedImage(null);
      setPreviewImage(null);
      setVisibility('public');
      
      // Notify parent component
      onPostCreated();
      
      toast.success("Post created successfully!");
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
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
      
      {/* Image Preview */}
      {previewImage && (
        <div className="mt-3 relative">
          <img 
            src={previewImage} 
            alt="Preview" 
            className="w-full h-auto max-h-[200px] object-contain rounded-lg"
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
          >
            <Lock className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {/* Selected Mood Display */}
      {selectedMood && (
        <div className="mt-2 text-sm text-primary flex items-center">
          <span>Feeling: {selectedMood}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-1"
            onClick={() => setSelectedMood(null)}
          >
            <Lock className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-3 border-t pt-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {/* Photo Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 flex items-center gap-1 hover:bg-gray-50 hover:text-primary shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Photo</span>
          </Button>
          
          {/* Mood Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 flex items-center gap-1 hover:bg-gray-50 hover:text-primary shrink-0"
              >
                <Smile className="h-4 w-4" />
                <span>Mood</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-4 gap-2">
                {moods.map((mood) => (
                  <Button
                    key={mood.name}
                    variant="ghost"
                    className="h-12 px-0 flex flex-col"
                    onClick={() => handleMoodSelect(mood.name, mood.emoji)}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.name}</span>
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Collab Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 flex items-center gap-1 hover:bg-gray-50 hover:text-primary shrink-0"
            onClick={() => navigate('/create-collab')}
          >
            <Users className="h-4 w-4" />
            <span>Collab</span>
          </Button>
          
          {/* Visibility Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 flex items-center gap-1 hover:bg-gray-50 hover:text-primary shrink-0"
              >
                {getVisibilityIcon()}
                <span>{getVisibilityLabel()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0">
              <div className="flex flex-col">
                <Button 
                  variant={visibility === 'public' ? 'secondary' : 'ghost'} 
                  className="justify-start rounded-none"
                  onClick={() => setVisibility('public')}
                >
                  <Globe className="h-4 w-4 mr-2" /> Public
                </Button>
                <Button 
                  variant={visibility === 'friends' ? 'secondary' : 'ghost'} 
                  className="justify-start rounded-none"
                  onClick={() => setVisibility('friends')}
                >
                  <Users2 className="h-4 w-4 mr-2" /> Friends
                </Button>
                <Button 
                  variant={visibility === 'private' ? 'secondary' : 'ghost'} 
                  className="justify-start rounded-none"
                  onClick={() => setVisibility('private')}
                >
                  <Lock className="h-4 w-4 mr-2" /> Only Me
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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
