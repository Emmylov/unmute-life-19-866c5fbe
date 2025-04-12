
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { addComment, getComments } from "@/services/content-service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    avatar: string | null;
    full_name: string | null;
  };
}

interface ReelCommentModalProps {
  reelId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReelCommentModal = ({ reelId, isOpen, onClose }: ReelCommentModalProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && reelId) {
      fetchComments();
    }
  }, [isOpen, reelId]);

  const fetchComments = async () => {
    if (!reelId) return;
    
    setIsLoading(true);
    try {
      const commentsData = await getComments(reelId);
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user?.id || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const comment = await addComment(user.id, reelId, newComment.trim());
      
      // Add the new comment with the user's profile info
      const newCommentWithProfile = {
        ...comment,
        profiles: {
          id: user.id,
          username: user.email?.split('@')[0] || "user",
          avatar: user.user_metadata?.avatar_url || null,
          full_name: user.user_metadata?.full_name || null
        }
      };
      
      setComments([...comments, newCommentWithProfile]);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-2">No comments yet</p>
              <p className="text-sm text-muted-foreground">Be the first to add a comment!</p>
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-4 max-h-[50vh]">
              <div className="space-y-4 py-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      {comment.profiles.avatar ? (
                        <AvatarImage src={comment.profiles.avatar} alt={comment.profiles.username} />
                      ) : (
                        <AvatarFallback>{getInitials(comment.profiles.full_name || comment.profiles.username)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h4 className="text-sm font-semibold">
                          {comment.profiles.full_name || comment.profiles.username}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          
          <form onSubmit={handleSubmitComment} className="flex items-end gap-2 pt-4 border-t mt-auto">
            <div className="flex-1">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
                disabled={isSubmitting || !user}
              />
            </div>
            <Button 
              type="submit" 
              size="icon" 
              disabled={!newComment.trim() || isSubmitting || !user}
              className={isSubmitting ? 'opacity-70' : ''}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send comment</span>
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReelCommentModal;
