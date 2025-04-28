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
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { addComment, getComments } from "@/services/comment-service";
import { useTranslation } from "react-i18next";

interface PostCardProps {
  post: any;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const { toggleLikePost, checkPostLikeStatus, isLiking, checkPostExists, getPostLikesCount } = useSocialActions();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isValidPost, setIsValidPost] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  
  if (!post || !post.id) {
    console.log("Skipping invalid post:", post);
    return null;
  }

  useEffect(() => {
    if (!post?.id) {
      setIsValidPost(false);
      return;
    }
    
    const fetchPostData = async () => {
      if (user && post?.id) {
        try {
          const exists = await checkPostExists(post.id);
          if (!exists) {
            console.log(`Post ${post.id} no longer exists`);
            setIsValidPost(false);
            return;
          }
          
          setIsValidPost(true);
          
          try {
            const liked = await checkPostLikeStatus(post.id);
            setIsLiked(liked);
            
            const count = await getPostLikesCount(post.id);
            setLikesCount(count);
          } catch (dataError) {
            console.error("Error fetching post data:", dataError);
            setIsValidPost(true);
          }
        } catch (error) {
          console.error("Error checking if post exists:", error);
          setIsValidPost(false);
        }
      }
    };
    
    fetchPostData();
    
    if (showComments) {
      fetchComments();
    }
  }, [post?.id, user, checkPostLikeStatus, showComments, checkPostExists, getPostLikesCount]);

  const fetchComments = async () => {
    if (!post?.id || !isValidPost) return;
    
    setIsLoading(true);
    try {
      const fetchedComments = await getComments(post.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeClick = async () => {
    if (!user) {
      toast.error(t('auth.signInRequired', 'Please sign in to like posts'));
      return;
    }
    
    if (!post?.id || !isValidPost) {
      return;
    }
    
    const previousLiked = isLiked;
    setIsLiked(!isLiked);
    setLikesCount(prevCount => previousLiked ? prevCount - 1 : prevCount + 1);
    
    try {
      const result = await toggleLikePost(post.id);
      if (result !== !previousLiked) {
        setIsLiked(result);
        setLikesCount(await getPostLikesCount(post.id));
      }
    } catch (error) {
      setIsLiked(previousLiked);
      setLikesCount(await getPostLikesCount(post.id));
      console.error("Error liking post:", error);
    }
  };
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(t('auth.signInRequired', 'Please sign in to comment'));
      return;
    }
    
    if (!comment.trim()) {
      toast.error(t('common.error.emptyComment', 'Comment cannot be empty'));
      return;
    }
    
    if (!post?.id || !isValidPost) {
      return;
    }
    
    try {
      const newComment = await addComment(post.id, user.id, comment.trim());
      if (newComment) {
        setComments([newComment, ...comments]);
        setComment('');
        toast.success(t('common.success.commentAdded', 'Comment added'));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(t('common.error.addComment', 'Failed to add comment'));
    }
  };

  const handleShare = () => {
    toast.info(t('common.comingSoon.share', 'Sharing will be available soon!'));
  };
  
  const handleSave = () => {
    toast.info(t('common.comingSoon.save', 'Saving posts will be available soon!'));
  };

  if (!isValidPost) {
    return null;
  }

  if (!post) {
    return null;
  }

  const profileUsername = post.profile?.username || post.profiles?.username || 'anonymous';
  const profileAvatar = post.profile?.avatar || post.profiles?.avatar;
  const profileFullName = post.profile?.full_name || post.profiles?.full_name || profileUsername;
  
  return (
    <>
      <Card className="w-full overflow-hidden">
        <div className="flex items-start gap-3 p-4">
          <Link to={`/profile/${profileUsername || post.user_id}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={profileAvatar} alt={profileUsername} />
              <AvatarFallback>{profileUsername?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Link to={`/profile/${profileUsername || post.user_id}`}>
                  <p className="text-sm font-medium leading-none">{profileFullName}</p>
                </Link>
                <Link to={`/profile/${profileUsername || post.user_id}`}>
                  <p className="text-sm text-gray-500">
                    @{profileUsername} · {formatTimeAgo(post.created_at)}
                  </p>
                </Link>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm mt-1">{post.content || post.body}</p>
          </div>
        </div>

        {post.image_url && (
          <Skeleton className="w-full aspect-video rounded-none" >
            <img src={post.image_url} alt="Post Image" className="w-full aspect-video object-cover" />
          </Skeleton>
        )}

        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLikeClick} 
                disabled={isLiking[post.id]}
                aria-label={isLiked ? t('common.unlike', 'Unlike post') : t('common.like', 'Like post')}
              >
                <Heart className={cn("h-5 w-5", isLiked && "text-red-500")} fill={isLiked ? 'red' : 'none'} />
              </Button>
              <span className="text-sm">{likesCount > 0 ? likesCount : ''}</span>
            </div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowComments(!showComments)}
                aria-label={showComments ? t('common.hideComments', 'Hide comments') : t('common.showComments', 'Show comments')}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <span className="text-sm">{comments.length > 0 ? comments.length : ''}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare}
              aria-label="Share post"
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSave}
            aria-label="Save post"
          >
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>

        <Dialog open={showComments} onOpenChange={setShowComments}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>{t('common.comments', 'Comments')}</DialogTitle>
            <DialogDescription>{t('common.commentsDescription', 'Join the conversation by adding your comment below.')}</DialogDescription>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.profiles?.avatar} alt={comment.profiles?.username} />
                      <AvatarFallback>{comment.profiles?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{comment.profiles?.username}</p>
                      <p className="text-sm text-gray-500">{comment.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimeAgo(comment.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  {t('common.noComments', 'No comments yet. Be the first!')}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmitComment} className="border-t p-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('common.addComment', 'Add a comment...')}
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button 
                  type="submit" 
                  disabled={!comment.trim()}
                  size="sm"
                >
                  {t('common.post', 'Post')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
};

export default PostCard;
