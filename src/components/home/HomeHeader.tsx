
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-responsive";
import { motion } from "framer-motion";

const HomeHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full">
      <Tabs defaultValue="foryou" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-transparent sticky top-0 z-10">
          <TabsTrigger 
            value="foryou"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-unmute-purple data-[state=active]:to-unmute-pink data-[state=active]:text-white rounded-full py-2.5 transition-all duration-300"
          >
            For You
          </TabsTrigger>
          <TabsTrigger 
            value="following"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-unmute-purple data-[state=active]:to-unmute-pink data-[state=active]:text-white rounded-full py-2.5 transition-all duration-300"
          >
            Following
          </TabsTrigger>
        </TabsList>
        <TabsContent value="foryou" className="mt-2">
          {/* For you content will be populated by the feed below */}
        </TabsContent>
        <TabsContent value="following" className="mt-2">
          {/* Following content will be populated when selected */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeHeader;
