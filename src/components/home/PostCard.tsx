
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Heart, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  post: {
    id: number | string;
    author?: string;
    username?: string;
    avatar?: string;
    date?: string;
    content: string;
    likes?: number;
    comments?: number;
    mood?: string;
    created_at: string;
    image_url?: string;
    profiles?: {
      username?: string;
      avatar?: string;
      full_name?: string;
    };
  };
}

const PostCard = ({ post }: PostCardProps) => {
  // Convert the post format to handle both old and new formats
  const authorName = post.author || post.profiles?.full_name || post.profiles?.username || "Anonymous";
  const authorAvatar = post.avatar || post.profiles?.avatar || '';
  const authorUsername = post.username || post.profiles?.username || "user";
  const postDate = post.date || formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        {/* Post Header - User Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 ring-2 ring-white">
            <AvatarImage src={authorAvatar} />
            <AvatarFallback className="bg-primary text-white">
              {authorUsername[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{authorName}</h4>
            <p className="text-xs text-gray-500">{postDate}</p>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          {post.image_url && (
            <img 
              src={post.image_url} 
              alt="Post content" 
              className="mt-3 rounded-lg w-full object-cover max-h-96"
            />
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Heart className="h-4 w-4 mr-1" />
              Like
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <MessageCircle className="h-4 w-4 mr-1" />
              Comment
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
