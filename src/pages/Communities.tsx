
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  image: string;
  tags: string[];
}

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryToggle = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  // Demo data for communities
  const communities: Community[] = [
    {
      id: "1",
      name: "Mental Health Matters",
      description: "A safe space to discuss mental health and support each other",
      memberCount: 2456,
      image: "/placeholder.svg",
      tags: ["Mental Health", "Support", "Wellbeing"],
    },
    {
      id: "2",
      name: "Teen Leadership",
      description: "For teens who want to develop their leadership skills",
      memberCount: 1872,
      image: "/placeholder.svg",
      tags: ["Leadership", "Growth", "Networking"],
    },
    {
      id: "3",
      name: "Climate Action Now",
      description: "Join teens fighting for climate justice",
      memberCount: 3201,
      image: "/placeholder.svg",
      tags: ["Climate", "Activism", "Environment"],
    },
    {
      id: "4",
      name: "Creative Writers Circle",
      description: "Share your writing, get feedback, and improve your craft",
      memberCount: 942,
      image: "/placeholder.svg",
      tags: ["Writing", "Creative", "Arts"],
    },
    {
      id: "5",
      name: "Music Producers",
      description: "For teen musicians and producers to collaborate",
      memberCount: 1567,
      image: "/placeholder.svg",
      tags: ["Music", "Production", "Collaboration"],
    },
  ];

  // Filter communities based on search and category
  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!activeCategory || community.tags.includes(activeCategory))
  );

  const categories = [
    "Mental Health", 
    "Arts", 
    "Activism", 
    "Leadership", 
    "Music", 
    "Environment"
  ];

  return (
    <AppLayout pageTitle="Communities">
      <div className="px-1 md:px-2 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Communities</h1>
          <p className="text-gray-600">
            Connect with like-minded teens and join conversations that matter.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {/* Search and filters */}
            <div className="mb-6 flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  type="text"
                  placeholder="Search communities..."
                  className="pl-10 bg-gray-50/80 border-none focus-visible:ring-unmute-purple/30 rounded-full w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={activeCategory === category ? "default" : "outline"}
                    className={`rounded-full text-xs px-4 py-2 whitespace-nowrap ${
                      activeCategory === category 
                        ? "bg-primary text-white" 
                        : "bg-white/90 text-primary hover:bg-primary/10"
                    }`}
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Community listings */}
            <div className="grid gap-4">
              {filteredCommunities.length > 0 ? (
                filteredCommunities.map((community) => (
                  <motion.div 
                    key={community.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow flex"
                  >
                    <Avatar className="h-16 w-16 rounded-lg mr-4 flex-shrink-0">
                      <AvatarImage src={community.image} alt={community.name} />
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-unmute-purple to-unmute-pink text-white">
                        {community.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-lg">{community.name}</h3>
                        <Badge variant="outline" className="flex items-center gap-1 px-2">
                          <Users className="h-3 w-3" />
                          <span>{community.memberCount.toLocaleString()}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mt-1 mb-2">{community.description}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-1 flex-wrap">
                          {community.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button size="sm" variant="outline" className="text-xs flex items-center gap-1">
                          <UserPlus className="h-3 w-3" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-xl font-medium mb-2">No communities found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try adjusting your search or filters, or check back later for new communities.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="bg-gray-50 rounded-xl p-5 sticky top-20">
              <h3 className="font-medium text-lg mb-3">Create a Community</h3>
              <p className="text-gray-600 text-sm mb-4">
                Have something to share with the world? Start your own community and build a supportive space.
              </p>
              <Button className="w-full">Create Community</Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Communities;
