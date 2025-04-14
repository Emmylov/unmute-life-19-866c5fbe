
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CommunityRecommendationsStepProps {
  onNext: () => void;
  onUpdateData: (data: any) => void;
  interests: string[];
  data: string[];
}

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon: string;
  topics: string[];
  lastActivity: string;
}

// This would eventually come from an API based on user interests
const mockCommunities: Community[] = [
  {
    id: "climate-heroes",
    name: "Climate Heroes",
    description: "Taking action together for a sustainable future",
    memberCount: 3452,
    icon: "🌍",
    topics: ["climate", "environmentalism"],
    lastActivity: "Just now"
  },
  {
    id: "mindful-moments",
    name: "Mindful Moments",
    description: "Share your wellness journey and mental health insights",
    memberCount: 2891,
    icon: "🧠",
    topics: ["mental-health-adv", "self-improvement"],
    lastActivity: "5m ago"
  },
  {
    id: "creative-corner",
    name: "Creative Corner",
    description: "Express yourself through art, writing, and creative projects",
    memberCount: 4103,
    icon: "🎨",
    topics: ["art", "poetry", "journaling"],
    lastActivity: "2h ago"
  },
  {
    id: "activist-hub",
    name: "Activist Hub",
    description: "Connecting changemakers and organizing for impact",
    memberCount: 1875,
    icon: "✊",
    topics: ["human-rights", "racial-justice", "gender-equality"],
    lastActivity: "1h ago"
  },
  {
    id: "gaming-guild",
    name: "Gaming Guild",
    description: "Connect with fellow gamers in a supportive environment",
    memberCount: 3215,
    icon: "🎮",
    topics: ["gaming", "tech"],
    lastActivity: "Just now"
  },
];

const CommunityRecommendationsStep = ({ 
  onNext, 
  onUpdateData,
  interests,
  data 
}: CommunityRecommendationsStepProps) => {
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>(data || []);
  const [loading, setLoading] = useState(true);
  const [recommendedCommunities, setRecommendedCommunities] = useState<Community[]>([]);
  
  useEffect(() => {
    // Simulate API call to get recommended communities based on interests
    setLoading(true);
    setTimeout(() => {
      // Filter communities based on user interests
      if (interests && interests.length > 0) {
        const filtered = mockCommunities.filter(community => 
          community.topics.some(topic => interests.includes(topic))
        );
        
        // If we don't have enough filtered communities, add some popular ones
        const recommendations = filtered.length >= 3 ? 
          filtered.slice(0, 5) : 
          [...filtered, ...mockCommunities.filter(c => !filtered.includes(c))].slice(0, 5);
        
        setRecommendedCommunities(recommendations);
      } else {
        // If no interests, just show the top communities
        setRecommendedCommunities(mockCommunities.slice(0, 5));
      }
      
      setLoading(false);
    }, 1200);
  }, [interests]);
  
  const toggleCommunity = (id: string) => {
    if (selectedCommunities.includes(id)) {
      setSelectedCommunities(selectedCommunities.filter(c => c !== id));
    } else {
      setSelectedCommunities([...selectedCommunities, id]);
    }
  };
  
  const handleNext = () => {
    onUpdateData({ communities: selectedCommunities });
    onNext();
  };
  
  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Recommended Communities</h2>
      <p className="text-center text-gray-600 mb-8">Join communities that match your interests</p>
      
      <div className="space-y-4 flex-grow overflow-y-auto">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center mb-3">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-3 w-full mt-2" />
              <Skeleton className="h-3 w-4/5 mt-2" />
            </div>
          ))
        ) : (
          recommendedCommunities.map(community => (
            <div 
              key={community.id} 
              className={`p-4 rounded-lg bg-white border cursor-pointer transition-all ${
                selectedCommunities.includes(community.id) 
                  ? "border-unmute-purple bg-unmute-purple/5" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleCommunity(community.id)}
            >
              <div className="flex items-start">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10 flex items-center justify-center text-2xl mr-3">
                  {community.icon}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{community.name}</h3>
                    <Button 
                      variant={selectedCommunities.includes(community.id) ? "default" : "outline"} 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCommunity(community.id);
                      }}
                    >
                      {selectedCommunities.includes(community.id) ? "Joined" : "Join"}
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{community.description}</p>
                  
                  <div className="flex items-center text-xs text-gray-500 space-x-3">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{community.memberCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span>Active {community.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={handleNext} 
          className="unmute-primary-button w-full"
        >
          {selectedCommunities.length > 0 
            ? `Continue with ${selectedCommunities.length} ${selectedCommunities.length === 1 ? 'community' : 'communities'}` 
            : "Skip for now"}
        </Button>
      </div>
    </div>
  );
};

export default CommunityRecommendationsStep;
