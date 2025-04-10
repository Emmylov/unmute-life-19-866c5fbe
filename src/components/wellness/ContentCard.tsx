
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, Headphones, Clock, Tag } from 'lucide-react';

interface ContentProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'video' | 'audio' | 'article';
  tag: string;
  duration: string;
  isPaid: boolean;
  price?: number;
  url: string;
}

interface ContentCardProps {
  content: ContentProps;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const getIcon = () => {
    switch(content.type) {
      case 'video': return <PlayCircle className="h-5 w-5" />;
      case 'article': return <FileText className="h-5 w-5" />;
      case 'audio': return <Headphones className="h-5 w-5" />;
      default: return null;
    }
  };
  
  const handleAccess = () => {
    if (content.isPaid) {
      console.log("Opening payment modal for", content.title);
      // Payment modal would open here
    } else {
      console.log("Accessing content", content.url);
      // Redirect to content URL
      window.open(content.url, "_blank");
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={content.imageUrl} 
          alt={content.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{content.title}</CardTitle>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            {getIcon()}
          </span>
        </div>
        <CardDescription className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {content.tag}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {content.duration}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <p>{content.description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          onClick={handleAccess} 
          className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
        >
          {content.isPaid ? `Unlock for ₦${content.price}` : 'View Content'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
