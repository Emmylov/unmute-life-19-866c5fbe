import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSocialActions } from "@/hooks/use-social-actions";
import { cn, formatTimeAgo } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface PostCardProps {
  post: any;
}

const PostCard = ({ post }: any) => {
  const { user } = useAuth();
  const { toggleLikePost, checkPostLikeStatus, isLiking } = useSocialActions();
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Check if post is already liked
    const checkLikeStatus = async () => {
      if (user) {
        const liked = await checkPostLikeStatus(post.id);
        setIsLiked(liked);
      }
    };
    
    checkLikeStatus();
  }, [post.id, user, checkPostLikeStatus]);

  const handleLikeClick = async () => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return;
    }
    
    const result = await toggleLikePost(post.id);
    setIsLiked(result);
  };
  
  const handleShare = () => {
    toast.info("Sharing will be available soon!");
  };
  
  const handleSave = () => {
    toast.info("Saving posts will be available soon!");
  };
  
  const handleSubmitComment = (e: any) => {
    e.preventDefault();
    if (comment.trim() !== '') {
      // Handle comment submission logic here
      console.log('Comment submitted:', comment);
      setComment('');
      setShowComments(true); // Show comments after submitting
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <Link to={`/profile/${post.profile?.username || post.user_id}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.profile?.avatar} alt={post.profile?.username} />
            <AvatarFallback>{post.profile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link to={`/profile/${post.profile?.username || post.user_id}`}>
                <p className="text-sm font-medium leading-none">{post.profile?.full_name || post.profile?.username}</p>
              </Link>
              <Link to={`/profile/${post.profile?.username || post.user_id}`}>
                <p className="text-sm text-gray-500">
                  @{post.profile?.username} · {formatTimeAgo(post.created_at)}
                </p>
              </Link>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm mt-1">{post.content}</p>
        </div>
      </div>

      {post.image_url && (
        <Skeleton className="w-full aspect-video rounded-none" >
          <img src={post.image_url} alt="Post Image" className="w-full aspect-video object-cover" />
        </Skeleton>
      )}

      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4 text-gray-500">
          <Button variant="ghost" size="icon" onClick={handleLikeClick} disabled={isLiking[post.id]}>
            <Heart className={cn("h-5 w-5", isLiked && "text-red-500")} fill={isLiked ? 'red' : 'none'} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSave}>
          <Bookmark className="h-5 w-5" />
        </Button>
      </div>

      {showComments && (
        <div className="p-4">
          <h4 className="text-sm font-semibold mb-2">Comments</h4>
          {/* Display comments here (fetch from database) */}
          <p className="text-sm text-gray-500">No comments yet. Be the first!</p>

          <form onSubmit={handleSubmitComment} className="mt-3">
            <div className="flex items-center">
              <Avatar className="h-7 w-7 mr-2">
                <AvatarImage src={user?.avatar || ''} alt={user?.username} />
                <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 border rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" size="sm" className="ml-2">Post</Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
};

export default PostCard;
