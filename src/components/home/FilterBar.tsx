
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Music, Sparkles, Filter, Users } from "lucide-react";
import { motion } from "framer-motion";

interface FilterBarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const FilterBar = ({ activeTab, onTabChange }: FilterBarProps) => {
  return (
    <motion.div 
      className="bg-white rounded-xl p-3 shadow-sm flex items-center space-x-2 overflow-x-auto scrollbar-hide border border-gray-100"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="bg-gray-50/80 p-1">
          <TabsTrigger 
            value="for-you" 
            className={`${
              activeTab === 'for-you' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-md' 
                : 'bg-transparent text-gray-600 hover:bg-gray-100/80'
            } border-none px-4 py-1.5 rounded-full transition-all duration-200`}
          >
            For You
          </TabsTrigger>
          <TabsTrigger 
            value="following" 
            className={`${
              activeTab === 'following' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-md' 
                : 'bg-transparent text-gray-600 hover:bg-gray-100/80'
            } border-none px-4 py-1.5 rounded-full transition-all duration-200`}
          >
            Following
          </TabsTrigger>
          <TabsTrigger 
            value="music" 
            className={`${
              activeTab === 'music' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-md' 
                : 'bg-transparent text-gray-600 hover:bg-gray-100/80'
            } border-none px-4 py-1.5 rounded-full transition-all duration-200`}
          >
            <Music className="h-3.5 w-3.5 mr-1" />
            Music
          </TabsTrigger>
          <TabsTrigger 
            value="trending" 
            className={`${
              activeTab === 'trending' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-md' 
                : 'bg-transparent text-gray-600 hover:bg-gray-100/80'
            } border-none px-4 py-1.5 rounded-full transition-all duration-200`}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Trending
          </TabsTrigger>
          <TabsTrigger 
            value="collabs" 
            className={`${
              activeTab === 'collabs' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-md' 
                : 'bg-transparent text-gray-600 hover:bg-gray-100/80'
            } border-none px-4 py-1.5 rounded-full transition-all duration-200`}
          >
            <Users className="h-3.5 w-3.5 mr-1" />
            Collabs
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="shrink-0 text-primary border-primary/30 hover:bg-primary/5"
      >
        <Filter className="h-4 w-4 mr-1" />
        Filter
      </Button>
    </motion.div>
  );
};

export default FilterBar;
