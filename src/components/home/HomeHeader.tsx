
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HomeHeader = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="foryou" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="foryou">For You</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
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
