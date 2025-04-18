
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-responsive";

const HomeHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`w-full ${isMobile ? 'px-4' : ''}`}>
      <Tabs defaultValue="foryou" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-transparent">
          <TabsTrigger 
            value="foryou"
            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full"
          >
            For You
          </TabsTrigger>
          <TabsTrigger 
            value="following"
            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full"
          >
            Following
          </TabsTrigger>
        </TabsList>
        <TabsContent value="foryou" className="mt-0">
          {/* For you content will be populated by the feed below */}
        </TabsContent>
        <TabsContent value="following" className="mt-0">
          {/* Following content will be populated when selected */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeHeader;
