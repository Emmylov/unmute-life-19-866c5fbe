
import React, { useState, KeyboardEvent } from 'react';
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ 
  tags, 
  setTags, 
  placeholder = "Add tags separated by Enter" 
}) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };
  
  const addTag = () => {
    // Replace any leading # and remove spaces
    const tagValue = inputValue.replace(/^#/, '').trim();
    
    if (tagValue && !tags.includes(tagValue)) {
      setTags([...tags, tagValue]);
      setInputValue('');
    }
  };
  
  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-background rounded-md border">
      {tags.map((tag, index) => (
        <div 
          key={index} 
          className="bg-primary/10 text-primary rounded-full px-2 py-1 text-sm flex items-center gap-1 group"
        >
          #{tag}
          <button 
            type="button"
            onClick={() => removeTag(index)} 
            className="text-primary/70 hover:text-primary"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-grow border-none outline-none p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};
