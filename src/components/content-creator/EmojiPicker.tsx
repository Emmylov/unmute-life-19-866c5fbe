
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ 
  selectedEmoji, 
  onEmojiSelect 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Common emoji sets by category
  const emojis = {
    smileys: ['😊', '😂', '🥰', '😍', '😎', '🥺', '😭', '😤', '🙃', '😴'],
    gestures: ['👍', '👎', '👏', '🙌', '🤝', '✌️', '🤞', '🤟', '🤘', '👌'],
    animals: ['🐶', '🐱', '🦁', '🐼', '🐨', '🐯', '🦊', '🦄', '🐝', '🦋'],
    food: ['🍕', '🍔', '🍟', '🍩', '🍦', '🍓', '🍑', '🥑', '🍆', '🍇'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🎮', '🎨', '🎭', '🎬', '🎤', '🎧'],
    travel: ['✈️', '🚗', '🚲', '⛵', '🚀', '🏝️', '🏔️', '🏙️', '🌋', '🗽'],
    objects: ['💻', '📱', '💰', '💎', '🎁', '🔮', '📷', '🔍', '🔑', '💡'],
    symbols: ['❤️', '💙', '💚', '💛', '💜', '💔', '❣️', '💯', '💢', '🔥'],
  };
  
  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className={selectedEmoji ? "text-2xl font-emoji p-0" : ""}
        >
          {selectedEmoji || <Smile className="h-5 w-5" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 max-h-[350px] overflow-y-auto">
          {Object.entries(emojis).map(([category, emojiList]) => (
            <div key={category} className="mb-4">
              <h4 className="text-sm font-medium mb-2 capitalize">{category}</h4>
              <div className="grid grid-cols-10 gap-1">
                {emojiList.map((emoji, index) => (
                  <button
                    key={index}
                    className="text-2xl p-1 hover:bg-muted rounded cursor-pointer"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
