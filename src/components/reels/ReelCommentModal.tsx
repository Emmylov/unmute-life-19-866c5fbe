
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getReelComments, addReelComment, deleteReelComment } from '@/services/comment-service';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    username: string;
    avatar?: string;
    full_name?: string;
  };
}

interface ReelCommentModalProps {
  reelId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReelCommentModal: React.FC<ReelCommentModalProps> = ({ reelId, isOpen, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchComments = async () => {
    if (!reelId) return;
    
    setIsLoading(true);
    try {
      const data = await getReelComments(reelId);
      console.log("Fetched reel comments:", data);
      setComments(data as Comment[]);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && reelId) {
      fetchComments();
    }
  }, [isOpen, reelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Submitting comment for reel:", reelId, newComment);
      const commentData = await addReelComment(reelId, user.id, newComment);
      console.log("Comment added successfully:", commentData);
      
      if (commentData) {
        setComments(prev => [commentData as unknown as Comment, ...prev]);
        setNewComment('');
        toast.success('Comment added');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user) return;
    
    try {
      await deleteReelComment(commentId, user.id);
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Comments</DialogTitle>
        </DialogHeader>
        
        <div className="h-[50vh] overflow-y-auto space-y-4 p-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 group">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.profiles?.avatar || undefined} />
                  <AvatarFallback>{comment.profiles?.username?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="font-medium text-sm">{comment.profiles?.username || 'User'}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500 gap-4">
                    <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                    {user && user.id === comment.user_id && (
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {user && (
          <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
          <p className="text-center text-sm text-gray-500 mt-4">
            You need to be logged in to comment.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReelCommentModal;
