
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const TrendingTopics = () => {
  return (
    <Card className="shadow-sm border-none overflow-hidden rounded-xl">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Trending Topics</h3>
        <div className="flex flex-wrap gap-2">
          {["#climateaction", "#mentalhealth", "#techtrends", "#creativity", "#musiclife"].map((topic) => (
            <div 
              key={topic} 
              className="bg-dream-mist px-3 py-1.5 rounded-full text-xs font-medium text-primary/80 cursor-pointer hover:bg-primary/10 transition-colors"
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
