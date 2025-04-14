
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send, User } from 'lucide-react';
import { AnonymousPost, AnonymousResponse } from './types';

interface AnonymousPostProps {
  post: AnonymousPost;
  onAddSupport: (postId: string) => void;
  onAddResponse: (postId: string, message: string) => void;
}

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const PostResponse = ({ response }: { response: AnonymousResponse }) => {
  return (
    <div className="mt-3 border-l-2 border-[#D6BCFA]/50 pl-4">
      <div className="flex items-center">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
          response.isStaff ? "bg-[#E5DEFF]" : "bg-gray-100" 
        }`}>
          <User className={`h-4 w-4 ${
            response.isStaff ? "text-[#9b87f5]" : "text-gray-500"
          }`} />
        </div>
        <div>
          <div className="flex items-center">
            <div className="font-medium text-sm">
              {response.isStaff ? "Wellness Expert" : "Anonymous"}
            </div>
            {response.isStaff && (
              <Badge variant="outline" className="ml-2 py-0 h-5">Staff</Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">{formatDate(response.date)}</div>
        </div>
      </div>
      <div className="mt-1 ml-10">
        <p className="text-sm">{response.message}</p>
      </div>
    </div>
  );
};

const AnonymousPostCard = ({ post, onAddSupport, onAddResponse }: AnonymousPostProps) => {
  const [showResponseInput, setShowResponseInput] = useState(false);
  const [responseText, setResponseText] = useState("");

  const handleRespond = () => {
    if (responseText.trim().length === 0) return;
    onAddResponse(post.id, responseText);
    setResponseText("");
    setShowResponseInput(false);
  };

  return (
    <Card key={post.id} className="border-2 border-[#D6BCFA]/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <div className="font-medium">Anonymous</div>
              <div className="text-xs text-muted-foreground">{formatDate(post.date)}</div>
            </div>
          </div>
          <Badge variant="outline">{post.tag}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{post.message}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-4">
          <Button 
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => onAddSupport(post.id)}
          >
            <Heart className="h-4 w-4 mr-1" />
            <span>{post.supportCount}</span>
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setShowResponseInput(!showResponseInput)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>{post.responses.length}</span>
          </Button>
        </div>
      </CardFooter>
      
      {/* Responses section */}
      {(post.responses.length > 0 || showResponseInput) && (
        <div className="px-6 pb-4">
          {post.responses.map(response => (
            <PostResponse key={response.id} response={response} />
          ))}
          
          {showResponseInput && (
            <div className="mt-4 flex gap-2">
              <Textarea 
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write a supportive response..."
                className="min-h-[80px]"
              />
              <Button 
                onClick={handleRespond}
                className="bg-[#9b87f5] hover:bg-[#7E69AB] self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default AnonymousPostCard;
