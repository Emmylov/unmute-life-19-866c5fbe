
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare } from "lucide-react";

interface RecommendedCommunitiesStepProps {
  onNext: () => void;
}

const recommendedCommunities = [
  {
    id: "mental-health",
    name: "Mental Health Support",
    members: 1234,
    description: "A safe space to share your mental health journey",
    activeDiscussions: 5
  },
  {
    id: "climate-action",
    name: "Climate Action Now",
    members: 892,
    description: "Taking action together for our planet",
    activeDiscussions: 3
  },
  {
    id: "creative-corner",
    name: "Creative Corner",
    members: 567,
    description: "Express yourself through art and creativity",
    activeDiscussions: 4
  }
];

const RecommendedCommunitiesStep = ({ onNext }: RecommendedCommunitiesStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2">Join Your Communities</h2>
      <p className="text-gray-600 mb-8 text-center">
        Find your people based on your interests
      </p>

      <div className="space-y-4 w-full max-w-md mb-8">
        {recommendedCommunities.map((community) => (
          <div
            key={community.id}
            className="unmute-bubble p-4 bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium mb-1">{community.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{community.description}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {community.members} members
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {community.activeDiscussions} active discussions
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        You can always join more communities later!
      </p>

      <Button onClick={onNext} className="unmute-primary-button">
        Next
      </Button>
    </div>
  );
};

export default RecommendedCommunitiesStep;
