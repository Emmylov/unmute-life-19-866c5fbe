
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    username: string;
    avatar: string | null;
  };
}

interface ReelCommentSectionProps {
  reelId: string;
  onClose: () => void;
}

const ReelCommentSection = ({ reelId, onClose }: ReelCommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [reelId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reel_comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (username, avatar)
        `)
        .eq("reel_id", reelId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load comments",
        });
      } else {
        const formattedComments = data.map(item => ({
          id: item.id,
          content: item.content,
          created_at: item.created_at,
          user_id: item.user_id,
          user: item.profiles
        }));
        setComments(formattedComments);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    
    try {
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData.user) {
        toast({
          variant: "destructive",
          title: "Not logged in",
          description: "Please log in to comment",
        });
        return;
      }
      
      const { error } = await supabase
        .from("reel_comments")
        .insert({
          reel_id: reelId,
          user_id: authData.user.id,
          content: newComment.trim()
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added",
      });
      
      setNewComment("");
      fetchComments();
      
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not post your comment",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="absolute inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="text-lg font-bold text-white">Comments</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar>
                <AvatarImage src={comment.user?.avatar || ''} />
                <AvatarFallback className="bg-primary text-white">
                  {comment.user?.username?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-semibold text-white">{comment.user?.username || 'Unknown User'}</p>
                  <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-800 p-4">
        <div className="flex space-x-2">
          <Textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="bg-gray-800 border-gray-700 text-white resize-none"
            rows={1}
          />
          <Button 
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReelCommentSection;
