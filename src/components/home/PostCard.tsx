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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { addComment, getComments, PostComment, PostType } from "@/services/content-service";
import { createSafeProfile } from "@/utils/safe-data-utils";
import { FeedPost } from "@/types/feed-post";

interface PostCardProps {
  post: FeedPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const { toggleLikePost, hasLikedPost, getPostLikesCount } = useSocialActions();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState<Record<string, boolean>>({}); // Add missing isLiking state
  const { t } = useTranslation();
  
  useEffect(() => {
    // Set initial like count from the post data
    setLikesCount(post.likes_count || 0);
    
    // Check if the current user has liked this post
    const checkLikeStatus = async () => {
      if (user && post.id) {
        try {
          // Fixed: Pass parameters in correct order - postId, userId, postType
          const hasLiked = await hasLikedPost(post.id, user.id, post.post_type || 'text');
          setLiked(hasLiked);
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      }
    };
    
    checkLikeStatus();
  }, [post.id, post.post_type, post.likes_count, user, hasLikedPost]);

  const handleLike = async () => {
    if (!user) {
      toast.error(t('auth.signInRequired', 'Please sign in to like this post'));
      return;
    }
    
    try {
      // Optimistic UI update
      const prevLikeState = liked;
      setLiked(!liked);
      setLikesCount(prevLikeState ? likesCount - 1 : likesCount + 1);
      
      // Make API call to toggle like
      // Fixed: Pass parameters in correct order - postId, userId, postType
      const result = await toggleLikePost(post.id, user.id, post.post_type || 'text');
      
      // If result is different from what we expected, revert the UI
      if (result !== !prevLikeState) {
        setLiked(result);
        // Fixed: Pass parameters in correct order - postId, postType
        const updatedLikesCount = await getPostLikesCount(post.id, post.post_type || 'text');
        setLikesCount(updatedLikesCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error(t('common.error.likePost', 'Failed to update like'));
    }
  };

  const handleOpenComments = async () => {
    setShowComments(true);
    if (comments.length === 0) {
      await loadComments();
    }
  };

  const loadComments = async () => {
    if (!post.id) return;
    
    setIsLoadingComments(true);
    try {
      // Fixed: pass in correct post_type parameter
      const fetchedComments = await getComments(post.id, post.post_type || 'text');
      // Ensure we have valid comments before setting them
      const validComments = Array.isArray(fetchedComments) ? fetchedComments : [];
      setComments(validComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error(t('common.error.loadComments', 'Failed to load comments'));
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error(t('auth.signInRequired', 'Please sign in to comment'));
      return;
    }
    
    if (!comment.trim()) {
      toast.error(t('common.error.emptyComment', 'Comment cannot be empty'));
      return;
    }
    
    setIsSubmittingComment(true);
    try {
      // Fixed: Pass correct post_type parameter
      const newComment = await addComment(post.id, user.id, comment, post.post_type || 'text');
      
      if (newComment) {
        // Make sure we properly handle the new comment
        setComments(prevComments => [newComment, ...prevComments]);
        setComment('');
        toast.success(t('common.success.commentAdded', 'Comment added'));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(t('common.error.addComment', 'Failed to add comment'));
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Render different post content based on type
  const renderPostContent = () => {
    switch (post.post_type) {
      case PostType.TEXT:
        return (
          <div className="mb-4">
            {post.title && <h2 className="text-xl font-semibold mb-2">{post.title}</h2>}
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{post.content}</p>
          </div>
        );
        
      case PostType.IMAGE:
        return (
          <div className="mb-4">
            {post.caption && <p className="text-gray-700 dark:text-gray-300 mb-2">{post.caption}</p>}
            <div className={`grid ${post.image_urls && post.image_urls.length > 1 ? 'grid-cols-2 gap-2' : 'grid-cols-1'}`}>
              {post.image_urls && post.image_urls.map((url, index) => (
                <img 
                  key={index}
                  src={url}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-auto rounded-lg object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        );
        
      case PostType.REEL:
        return (
          <div className="mb-4">
            {post.caption && <p className="text-gray-700 dark:text-gray-300 mb-2">{post.caption}</p>}
            <div className="aspect-video rounded-lg overflow-hidden">
              <video 
                src={post.video_url || ''}
                controls
                preload="metadata"
                className="w-full h-full object-cover"
                poster={post.thumbnail_url || post.image_urls?.[0] || ''}
              />
            </div>
          </div>
        );
        
      case PostType.MEME:
        return (
          <div className="mb-4 relative">
            <div className="relative">
              <img 
                src={post.image_urls?.[0] || ''}
                alt="Meme"
                className="w-full h-auto rounded-lg"
              />
              {post.title && (
                <h2 className="absolute top-4 left-0 w-full text-center text-white text-2xl font-bold stroke-text">
                  {post.title}
                </h2>
              )}
              {post.caption && (
                <h2 className="absolute bottom-4 left-0 w-full text-center text-white text-2xl font-bold stroke-text">
                  {post.caption}
                </h2>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300">
        {/* Post Header */}
        <div className="px-4 pt-4 pb-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.user_id}`}>
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={post.profiles?.avatar || ''} alt={post.profiles?.username || 'User'} />
                <AvatarFallback>{(post.profiles?.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link to={`/profile/${post.user_id}`} className="font-semibold text-sm hover:underline">
                {post.profiles?.username || 'Anonymous User'}
              </Link>
              <p className="text-xs text-gray-500">{formatTimeAgo(post.created_at)}</p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Post Content */}
        <div className="px-4 py-2">
          {renderPostContent()}
        </div>
        
        {/* Post tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-xs text-blue-500 dark:text-blue-400 hover:underline">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Post Actions */}
        <div className="px-4 py-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-6">
            {/* Like button */}
            <button
              onClick={handleLike}
              disabled={isLiking[post.id]}
              className={cn(
                "flex items-center gap-1",
                liked ? "text-red-500" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Heart className={cn("h-5 w-5", liked && "fill-current")} />
              <span className="text-sm">{likesCount > 0 ? likesCount : ''}</span>
            </button>
            
            {/* Comment button */}
            <button
              onClick={handleOpenComments}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{post.comments_count > 0 ? post.comments_count : ''}</span>
            </button>
            
            {/* Share button */}
            <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
              <Share className="h-5 w-5" />
            </button>
          </div>
          
          {/* Save button */}
          <button className="text-gray-500 hover:text-gray-700">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </Card>
      
      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-md">
          <DialogTitle>Comments</DialogTitle>
          
          {/* Add comment input */}
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="min-h-[80px]"
            />
            <Button 
              onClick={handleSubmitComment} 
              disabled={!comment.trim() || isSubmittingComment}
              className="self-end"
            >
              {isSubmittingComment ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
          
          {/* Comments list */}
          <div className="mt-4 max-h-[300px] overflow-y-auto space-y-4">
            {isLoadingComments ? (
              <p className="text-center text-gray-500">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-center text-gray-500">No comments yet. Be the first!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.profiles?.avatar || ''} />
                    <AvatarFallback>{(comment.profiles?.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <Link to={`/profile/${comment.user_id}`} className="font-semibold text-sm hover:underline">
                        {comment.profiles?.username || 'Anonymous User'}
                      </Link>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(comment.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PostCard;
