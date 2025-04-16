
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

const SuggestedUsers = () => {
  return (
    <Card className="mb-4 shadow-sm border-none overflow-hidden rounded-xl">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Suggested for you</h3>
        
        <div className="empty-state bg-dream-mist py-5 px-4 rounded-lg">
          <div className="flex justify-center mb-2">
            <UserPlus className="h-8 w-8 text-primary/40" />
          </div>
          <p className="text-center text-sm text-gray-500">
            We're looking for people you might like to follow
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedUsers;
