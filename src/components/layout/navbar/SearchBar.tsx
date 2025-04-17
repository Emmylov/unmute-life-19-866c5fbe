
import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  isMobile: boolean;
  isTablet: boolean;
}

const SearchBar = ({ isMobile, isTablet }: SearchBarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);
  
  return (
    <>
      {(!isMobile || (isMobile && isSearchOpen)) && (
        <div className={`${isSearchOpen ? 'absolute inset-x-0 top-0 bg-white px-2 py-1.5 z-30' : 'relative'} max-w-md w-full mx-1 ${isMobile ? 'hidden' : 'flex'} ${isTablet ? 'max-w-[130px] lg:max-w-md' : ''}`}>
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
            <Input 
              type="text" 
              placeholder="Search..."
              className="h-7 pl-6 bg-gray-50/80 border-none focus-visible:ring-unmute-purple/30 rounded-full w-full text-xs"
              ref={searchInputRef}
            />
            {isSearchOpen && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 w-5" 
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-500 h-7 w-7">
          <Search className="h-3.5 w-3.5" />
        </Button>
      )}
    </>
  );
};

export default SearchBar;
