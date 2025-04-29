import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image as ImageIcon, Smile, Loader2, Globe, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import MoodSelector from "@/components/home/MoodSelector";
import { createUnifiedTextPost, createUnifiedImagePost } from "@/services/unified-post-service";
import { uploadImage } from "@/services/upload-service";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "120px"; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [postText]);
  
  const handleCreatePost = async () => {
    if (!user) {
      toast.error("Please sign in to create a post");
      return;
    }
    
    if (!postText.trim() && !imageFile) {
      toast.error("Post cannot be empty");
      return;
    }
    
    setIsCreating(true);
    
    try {
      if (imageFile) {
        // Upload image first
        const imageUrl = await uploadImage(imageFile);
        
        // Create image post with optional text caption
        await createUnifiedImagePost(
          user.id, 
          [imageUrl], 
          postText.trim() || undefined
        );
      } else {
        // Create text post
        await createUnifiedTextPost(
          user.id, 
          postText.trim(), 
          undefined, 
          undefined, 
          moodEmoji || undefined,
          visibility
        );
      }
      
      // Clear form
      setPostText("");
      setMoodEmoji("");
      setImageFile(null);
      setImagePreview(null);
      
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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const triggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const visibilityOptions = [
    { value: "public", label: "Public", icon: Globe },
    { value: "private", label: "Private", icon: Lock },
  ];
  
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
              <Textarea
                ref={textareaRef}
                placeholder="What's on your mind?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="w-full min-h-[120px] focus:outline-none focus:ring-0 border rounded-lg p-3 pr-12 bg-white/80 backdrop-blur-sm resize-none"
                disabled={isCreating}
              />
              {moodEmoji && (
                <div className="absolute top-3 right-3 text-xl">
                  {moodEmoji}
                </div>
              )}
            </div>
            
            {/* Image preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="relative rounded-lg overflow-hidden"
                >
                  <img 
                    src={imagePreview} 
                    alt="Upload preview" 
                    className="w-full h-auto max-h-[200px] object-contain bg-gray-50"
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={removeImage}
                  >
                    <span className="sr-only">Remove image</span>
                    ×
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost"
                  onClick={triggerImageUpload}
                  disabled={isCreating}
                >
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                </Button>
                
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost"
                  onClick={() => setShowMoodPicker(!showMoodPicker)}
                  disabled={isCreating}
                >
                  <Smile className="h-5 w-5 text-gray-500" />
                </Button>
                
                {/* Visibility selector */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost"
                      size="icon"
                      className="text-gray-500"
                      disabled={isCreating}
                    >
                      {visibility === "public" ? 
                        <Globe className="h-5 w-5" /> : 
                        <Lock className="h-5 w-5" />}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-0" align="start">
                    <div className="py-1">
                      {visibilityOptions.map(option => (
                        <Button
                          key={option.value}
                          variant="ghost"
                          className={`w-full justify-start px-3 py-1.5 ${visibility === option.value ? 'bg-gray-100' : ''}`}
                          onClick={() => setVisibility(option.value as "public" | "private")}
                        >
                          <option.icon className="h-4 w-4 mr-2" />
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <Button 
                onClick={handleCreatePost} 
                disabled={(!postText.trim() && !imageFile) || isCreating}
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
                onClose={() => setShowMoodPicker(false)} 
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
