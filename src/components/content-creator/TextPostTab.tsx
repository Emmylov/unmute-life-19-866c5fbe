import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmojiPicker } from "@/components/content-creator/EmojiPicker";
import { TagInput } from "@/components/content-creator/TagInput";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Globe, Users, Lock, Calendar, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface TextPostTabProps {
  onSuccess: () => void;
}

const TextPostTab: React.FC<TextPostTabProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [mood, setMood] = useState<string>("");
  const [visibility, setVisibility] = useState("public");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  
  const handleSubmit = async (isDraft = false) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      
      // Get current timestamp
      const now = new Date();
      
      const postData = {
        user_id: user.id,
        title,
        content,
        tags,
        visibility: isDraft ? "draft" : visibility,
        created_at: isScheduled && scheduledDate ? scheduledDate : now.toISOString(),
        emoji_mood: selectedEmoji,
      };
      
      const { error } = await supabase.from('text_posts').insert(postData);
      
      if (error) {
        console.error("Error creating post:", error);
        return;
      }
      
      // Reset form
      setTitle("");
      setContent("");
      setTags([]);
      setMood("");
      setSelectedEmoji("");
      setVisibility("public");
      setIsScheduled(false);
      setScheduledDate("");
      
      if (!isDraft) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error in submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col md:flex-row gap-8"
    >
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title (Optional)</Label>
          <Input 
            id="title" 
            placeholder="Add a title to your post" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="body">Content</Label>
          <Textarea 
            id="body" 
            placeholder="What's on your mind?" 
            className="min-h-[200px] resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Tags</Label>
          <TagInput 
            tags={tags}
            setTags={setTags} 
          />
        </div>
        
        <div className="space-y-2">
          <Label>How are you feeling?</Label>
          <div className="flex items-center gap-4">
            <EmojiPicker 
              selectedEmoji={selectedEmoji}
              onEmojiSelect={setSelectedEmoji}
            />
            {selectedEmoji && (
              <span className="text-lg">
                {selectedEmoji}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Preview and settings panel */}
      <div className="md:w-[280px] space-y-6">
        <div className="p-4 rounded-lg bg-muted/50 border">
          <h3 className="font-semibold mb-4">Preview</h3>
          <div className="overflow-hidden rounded-md bg-background p-4 shadow-sm">
            {title && <h4 className="font-semibold mb-2">{title}</h4>}
            <p className="text-sm text-muted-foreground mb-2">{content || "What's on your mind?"}</p>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {selectedEmoji && (
              <div className="text-right text-lg mt-2">{selectedEmoji}</div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Tabs defaultValue="public" value={visibility} onValueChange={setVisibility}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="public" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </TabsTrigger>
                <TabsTrigger value="friends" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Friends
                </TabsTrigger>
                <TabsTrigger value="private" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="scheduled">Schedule post</Label>
              <input 
                type="checkbox" 
                id="scheduled" 
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="toggle"
              />
            </div>
            
            {isScheduled && (
              <div className="mt-2">
                <Input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting || !content}
            >
              Save as Draft
            </Button>
            <Button 
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || !content}
              className="relative overflow-hidden"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin mr-1">⏳</span> Posting...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Send className="h-4 w-4 mr-1" /> Post
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TextPostTab;
