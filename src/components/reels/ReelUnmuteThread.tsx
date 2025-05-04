
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { formatTimeAgo } from "@/lib/utils";
import { toast } from "sonner";
import { addComment, getComments, PostComment } from "@/services/content-service";

interface ReelUnmuteThreadProps {
  reelId: string;
  className?: string;
}

const ReelUnmuteThread: React.FC<ReelUnmuteThreadProps> = ({ reelId, className }) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    if (!reelId) return;
    
    setIsLoading(true);
    try {
      const fetchedComments = await getComments(reelId, 'reel');
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [reelId]);

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }
    
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await addComment(reelId, user.id, newComment, 'reel');
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Unmute Thread</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse">Loading conversations...</div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4 mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.profiles?.avatar || undefined} />
                <AvatarFallback>
                  {comment.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="font-medium text-sm">
                    {comment.profiles?.username || "Anonymous User"}
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(comment.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">
          No comments yet. Start a conversation!
        </div>
      )}
      
      {user ? (
        <div className="space-y-2">
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar || undefined} />
              <AvatarFallback>
                {profile?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
          <Button onClick={handleSubmitComment} className="ml-auto block" disabled={!newComment.trim()}>
            Post
          </Button>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          Sign in to join the conversation.
        </div>
      )}
    </div>
  );
};

export default ReelUnmuteThread;
