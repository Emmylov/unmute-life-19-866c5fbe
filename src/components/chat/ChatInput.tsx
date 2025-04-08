
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Send, Smile, Paperclip, Mic } from "lucide-react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

const emojis = ["😀", "😂", "❤️", "👍", "🔥", "🎉", "🙌", "👀", "💯", "✨"];

const ChatInput = ({ message, setMessage, handleSendMessage }: ChatInputProps) => {
  const [isRecording, setIsRecording] = useState(false);

  // Handle emoji selection
  const handleEmojiClick = (emoji: string) => {
    setMessage(message + emoji);
  };

  // Handle voice recording (simulate)
  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        // In a real app, here we would handle the voice recording
      }, 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <form 
      onSubmit={handleSendMessage}
      className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
    >
      <div className="flex items-end space-x-2">
        {/* Attachment button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        {/* Emoji picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-64">
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji) => (
                <Button
                  key={emoji}
                  type="button"
                  variant="ghost"
                  className="h-10 w-10 p-0 text-lg"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Message input */}
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-grow resize-none min-h-[44px] max-h-[120px]"
          rows={1}
          disabled={isRecording}
        />
        
        {/* Voice record button */}
        <Button
          type="button"
          variant={isRecording ? "default" : "ghost"}
          size="icon"
          className={`rounded-full ${isRecording ? "bg-red-500" : ""}`}
          onClick={handleVoiceRecord}
        >
          <Mic className="h-5 w-5" />
        </Button>
        
        {/* Send button */}
        <Button
          type="submit"
          disabled={!message.trim() && !isRecording}
          className="rounded-full bg-unmute-purple hover:bg-unmute-purple/90"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center mt-2 text-sm text-red-500">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          Recording voice message...
        </div>
      )}
    </form>
  );
};

export default ChatInput;
