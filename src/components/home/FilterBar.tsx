
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Music, Sparkles, Filter, Users } from "lucide-react";

interface FilterBarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const FilterBar = ({ activeTab, onTabChange }: FilterBarProps) => {
  return (
    <div 
      className="bg-white rounded-xl p-3 shadow-sm flex items-center space-x-2 overflow-x-auto scrollbar-hide border border-gray-100"
    >
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="bg-gray-100/80 p-1">
          <TabsTrigger 
            value="for-you" 
            className={`${
              activeTab === 'for-you' 
                ? 'bg-white text-primary shadow-sm' 
                : 'bg-transparent text-gray-600'
            } border-none px-4 py-1.5 rounded-full`}
          >
            For You
          </TabsTrigger>
          <TabsTrigger 
            value="following" 
            className={`${
              activeTab === 'following' 
                ? 'bg-white text-primary shadow-sm' 
                : 'bg-transparent text-gray-600'
            } border-none px-4 py-1.5 rounded-full`}
          >
            Following
          </TabsTrigger>
          <TabsTrigger 
            value="music" 
            className={`${
              activeTab === 'music' 
                ? 'bg-white text-primary shadow-sm' 
                : 'bg-transparent text-gray-600'
            } border-none px-4 py-1.5 rounded-full`}
          >
            <Music className="h-3.5 w-3.5 mr-1" />
            Music
          </TabsTrigger>
          <TabsTrigger 
            value="trending" 
            className={`${
              activeTab === 'trending' 
                ? 'bg-white text-primary shadow-sm' 
                : 'bg-transparent text-gray-600'
            } border-none px-4 py-1.5 rounded-full`}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Trending
          </TabsTrigger>
          <TabsTrigger 
            value="collabs" 
            className={`${
              activeTab === 'collabs' 
                ? 'bg-white text-primary shadow-sm' 
                : 'bg-transparent text-gray-600'
            } border-none px-4 py-1.5 rounded-full`}
          >
            <Users className="h-3.5 w-3.5 mr-1" />
            Collabs
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Button variant="ghost" size="sm" className="shrink-0">
        <Filter className="h-4 w-4 mr-1" />
        Filter
      </Button>
    </div>
  );
};

export default FilterBar;
