
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatTimeAgo } from "@/lib/utils";
import { addComment, getComments, deleteComment, PostComment } from "@/services/comment-service";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface ReelCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: string;
}

const ReelCommentModal: React.FC<ReelCommentModalProps> = ({ isOpen, onClose, reelId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");

  const fetchComments = async () => {
    if (!reelId) return;
    
    setIsLoading(true);
    try {
      const fetchedComments = await getComments(reelId, 'reel');
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && reelId) {
      fetchComments();
    }
  }, [isOpen, reelId]);

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await addComment(reelId, user.id, comment, 'reel');
      setComment("");
      fetchComments();
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    
    try {
      // Fix: Only pass the commentId
      await deleteComment(commentId);
      fetchComments();
      toast.success("Comment deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col h-full max-h-[80vh]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Comments</h2>
          </div>
          
          <ScrollArea className="flex-1 h-full max-h-[50vh]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <span className="animate-pulse">Loading comments...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-gray-500">No comments yet. Be the first!</span>
              </div>
            ) : (
              <div className="space-y-4 p-1">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.profiles?.avatar || undefined} />
                      <AvatarFallback>
                        {comment.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">
                          {comment.profiles?.username || 'Anonymous'}
                        </span>
                        {user && comment.user_id === user.id && (
                          <Button
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(comment.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {user && (
            <div className="mt-4 flex space-x-2">
              <Input
                className="flex-1"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <Button onClick={handleAddComment} disabled={!comment.trim()}>
                Post
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReelCommentModal;
