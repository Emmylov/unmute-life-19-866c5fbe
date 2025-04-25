
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const TrendingTopics = () => {
  return (
    <Card className="shadow-sm border-none overflow-hidden rounded-lg">
      <CardContent className="p-3">
        <h3 className="text-base font-semibold mb-2">Trending Topics</h3>
        <div className="flex flex-wrap gap-1.5">
          {["#climateaction", "#mentalhealth", "#techtrends", "#creativity", "#musiclife"].map((topic) => (
            <div 
              key={topic} 
              className="bg-dream-mist px-2 py-1 rounded-full text-xs font-medium text-primary/80 cursor-pointer hover:bg-primary/10 transition-colors"
            >
              {topic}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;
