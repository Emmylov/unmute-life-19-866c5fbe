import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Heart, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSocialActions } from "@/hooks/use-social-actions";
import { cn } from "@/lib/utils";
import OGBadge from "@/components/badges/OGBadge";

interface PostCardProps {
  post: {
    id: number | string;
    author?: string;
    username?: string;
    avatar?: string;
    date?: string;
    content?: string;
    body?: string; // For posts_text
    likes?: number;
    comments?: number;
    mood?: string;
    emoji_mood?: string; // For posts_text
    created_at: string;
    image_url?: string;
    image_urls?: string[];
    profiles?: {
      username?: string;
      avatar?: string;
      full_name?: string;
      is_og?: boolean;
    };
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const authorName = post.author || post.profiles?.full_name || post.profiles?.username || "Anonymous";
  const authorAvatar = post.avatar || post.profiles?.avatar || '';
  const authorUsername = post.username || post.profiles?.username || "user";
  const postDate = post.date || formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const postContent = post.content || post.body || '';
  const moodEmoji = post.mood || post.emoji_mood || '';
  const imageUrl = post.image_url || (post.image_urls && post.image_urls.length > 0 ? post.image_urls[0] : undefined);
  
  const [commentCount, setCommentCount] = useState(post.comments || 0);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const { toggleLikePost, isLiking } = useSocialActions();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = async () => {
    if (isLiking[post.id as string]) return;
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      const result = await toggleLikePost(post.id as string);
      if (result !== isLiked) {
        setIsLiked(result);
        setLikeCount(prev => result ? prev + 1 : prev - 1);
      }
    } catch (error) {
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      toast.error("Failed to update like status");
    }
  };

  const handleComment = () => {
    toast.info("Comment feature coming soon!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${authorName}`,
        text: postContent.substring(0, 50) + '...',
        url: window.location.href,
      }).then(() => {
        toast.success("Shared successfully");
      }).catch((error) => {
        if (error.name !== 'AbortError') {
          toast.error("Error sharing post");
        }
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Post removed from saved items" : "Post saved successfully");
  };

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 ring-2 ring-white">
            <AvatarImage src={authorAvatar} />
            <AvatarFallback className="bg-primary text-white">
              {authorUsername[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm">{authorName}</h4>
              {post.profiles?.is_og && <OGBadge />}
            </div>
            <div className="flex items-center">
              <p className="text-xs text-gray-500">{postDate}</p>
              {moodEmoji && (
                <span className="ml-2 text-sm" title="User's mood">
                  {moodEmoji}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-800 whitespace-pre-wrap">{postContent}</p>
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Post content" 
              className="mt-3 rounded-lg w-full object-cover max-h-96"
            />
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("text-gray-600", isLiked && "text-red-500")}
              onClick={handleLike}
              disabled={isLiking[post.id as string]}
            >
              <Heart className={cn("h-4 w-4 mr-1", isLiked && "fill-red-500")} />
              {likeCount > 0 ? likeCount : "Like"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600"
              onClick={handleComment}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {commentCount > 0 ? commentCount : "Comment"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("text-gray-600", isSaved && "text-blue-500")}
            onClick={handleSave}
          >
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-blue-500")} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
