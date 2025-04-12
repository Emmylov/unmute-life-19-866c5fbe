
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getReelComments, addReelComment, deleteReelComment } from "@/services/comment-service";
import { Loader2, Send, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReelCommentModalProps {
  reelId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReelCommentModal = ({ reelId, isOpen, onClose }: ReelCommentModalProps) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Fetch comments when modal opens
  useEffect(() => {
    if (isOpen && reelId) {
      fetchComments();
    }
  }, [isOpen, reelId]);

  const fetchComments = async () => {
    if (!reelId) return;
    
    try {
      setIsLoading(true);
      const data = await getReelComments(reelId);
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to comment");
      return;
    }
    
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addReelComment(reelId, user.id, newComment);
      setNewComment("");
      toast.success("Comment added");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    
    try {
      await deleteReelComment(commentId, user.id);
      toast.success("Comment deleted");
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        
        {/* Comments list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.profiles?.avatar || ""} />
                  <AvatarFallback>
                    {getInitials(comment.profiles?.full_name || comment.profiles?.username || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {comment.profiles?.username || "Unknown User"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                      {user && user.id === comment.user_id && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Comment form */}
        {user && (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2 border-t">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user.user_metadata?.avatar_url || ""} />
              <AvatarFallback>{getInitials(user.user_metadata?.name || "U")}</AvatarFallback>
            </Avatar>
            <Textarea
              className="flex-1 min-h-0 h-10 py-2 resize-none"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={500}
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        )}
        
        {!user && (
          <p className="text-center text-muted-foreground border-t pt-4">
            Please sign in to add a comment.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReelCommentModal;
