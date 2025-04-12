
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { addComment, getComments, deleteComment, updateComment } from "@/services/comment-service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Comment {
  id: string;
  user_id: string;
  reel_id?: string;
  post_id?: string;
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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
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

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId || !editContent.trim()) return;
    
    try {
      await updateComment(editingCommentId, editContent.trim(), true);
      
      // Update the comment in the local state
      setComments(comments.map(comment => 
        comment.id === editingCommentId 
          ? { ...comment, content: editContent.trim() } 
          : comment
      ));
      
      setEditingCommentId(null);
      setEditContent("");
      toast.success("Comment updated");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId, true);
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const isCommentOwner = (userId: string) => {
    return user?.id === userId;
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
                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold">
                            {comment.profiles.full_name || comment.profiles.username}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        
                        {isCommentOwner(comment.user_id) && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(comment)}
                              className="text-xs text-blue-500 hover:text-blue-600"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(comment.id)}
                              className="text-xs text-red-500 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {editingCommentId === comment.id ? (
                        <div className="mt-1">
                          <Textarea 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[60px] text-sm"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingCommentId(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="button" 
                              size="sm" 
                              onClick={handleUpdateComment}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm mt-1">{comment.content}</p>
                      )}
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
