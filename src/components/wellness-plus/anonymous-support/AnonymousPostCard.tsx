
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Send, MessageSquare } from 'lucide-react';
import { AnonymousPost } from './types';
import { formatDistanceToNow } from 'date-fns';

interface AnonymousPostCardProps {
  post: AnonymousPost;
  onAddSupport: (postId: string) => void;
  onAddResponse: (postId: string, message: string) => void;
}

const AnonymousPostCard: React.FC<AnonymousPostCardProps> = ({ post, onAddSupport, onAddResponse }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResponseInput, setShowResponseInput] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [supportClicked, setSupportClicked] = useState(false);

  const handleSupportClick = () => {
    if (!supportClicked) {
      onAddSupport(post.id);
      setSupportClicked(true);
    }
  };

  const handleSubmitResponse = () => {
    if (responseText.trim()) {
      onAddResponse(post.id, responseText);
      setResponseText('');
      setShowResponseInput(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            {post.tag}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(post.date, { addSuffix: true })}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{post.message}</p>
        
        {isExpanded && post.responses.length > 0 && (
          <div className="mt-4 space-y-4">
            {post.responses.map((response) => (
              <div 
                key={response.id} 
                className={`p-3 rounded-lg text-sm ${
                  response.isStaff 
                    ? "bg-[#E5DEFF]/50 border border-[#D6BCFA]/30" 
                    : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-xs">
                    {response.isStaff ? "Wellness Guide" : "Community Member"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(response.date, { addSuffix: true })}
                  </span>
                </div>
                <p>{response.message}</p>
              </div>
            ))}
          </div>
        )}
        
        {showResponseInput && (
          <div className="mt-4 space-y-2">
            <Textarea 
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your supportive response..."
              className="resize-none h-24"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowResponseInput(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                onClick={handleSubmitResponse}
                disabled={responseText.trim() === ''}
              >
                <Send className="h-3.5 w-3.5 mr-1" />
                Send
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 text-xs ${supportClicked ? "text-pink-500" : ""}`}
            onClick={handleSupportClick}
          >
            <Heart className={`h-3.5 w-3.5 ${supportClicked ? "fill-pink-500" : ""}`} />
            <span>Support ({supportClicked ? post.supportCount + 1 : post.supportCount})</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={() => setShowResponseInput(!showResponseInput)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Respond</span>
          </Button>
        </div>
        
        {post.responses.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? "Hide Responses" : `View ${post.responses.length} Responses`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AnonymousPostCard;
