
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Info } from 'lucide-react';

interface ShareFormProps {
  onSubmit: (message: string) => void;
}

const ShareForm: React.FC<ShareFormProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#F1F0FB] border border-[#D6BCFA]/30 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-[#9b87f5] mt-0.5" />
        <div>
          <h3 className="font-medium text-sm mb-1">Safe Space Guidelines</h3>
          <ul className="text-sm space-y-1">
            <li>• Your identity remains anonymous</li>
            <li>• Focus on your feelings and experiences</li>
            <li>• Be respectful and supportive of others</li>
            <li>• In crisis? Call 800-273-8255 for immediate help</li>
          </ul>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center gap-2 text-[#9b87f5]">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">Anonymous Message</span>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind? Share your thoughts safely here..."
            className="resize-none h-40"
          />
        </CardContent>
        <CardFooter className="justify-end">
          <Button 
            onClick={handleSubmit}
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
            disabled={message.trim() === ''}
          >
            Share Anonymously
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ShareForm;
