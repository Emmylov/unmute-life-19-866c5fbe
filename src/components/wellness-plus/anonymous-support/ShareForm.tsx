
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Send, ThumbsUp } from 'lucide-react';

interface ShareFormProps {
  onSubmit: (message: string) => void;
}

const ShareForm = ({ onSubmit }: ShareFormProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = () => {
    if (message.trim().length === 0) return;
    onSubmit(message);
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">How are you feeling?</h3>
        <Textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your thoughts, feelings, or concerns anonymously..."
          className="min-h-[150px]"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Badge variant="outline" className="mr-3">Anonymous</Badge>
          <div className="text-xs text-muted-foreground">
            Your identity is completely private
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsRecording(!isRecording)}
          className={isRecording ? "text-red-500" : ""}
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <ThumbsUp className="h-4 w-4 mr-2 text-[#9b87f5]" />
          Guidelines for sharing
        </h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Be honest about your feelings, this is a safe space</li>
          <li>• Don't include names or specific identifying details</li>
          <li>• If you're in immediate danger, please contact emergency services</li>
          <li>• Support others with kindness and empathy</li>
        </ul>
      </div>
      
      <Button 
        onClick={handleSubmit}
        className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
        disabled={message.trim().length === 0}
      >
        Share Anonymously
      </Button>
    </div>
  );
};

export default ShareForm;
