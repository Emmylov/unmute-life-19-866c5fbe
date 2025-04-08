
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Users, Video, Hash, X, ChevronRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import TrendingReelCard from "@/components/explore/TrendingReelCard";
import CommunityCard from "@/components/explore/CommunityCard";
import CreatorProfileCard from "@/components/explore/CreatorProfileCard";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const isMobile = useIsMobile();

  // Sample data (in a real app, this would come from your Supabase database)
  const categories = ["All", "Music", "Mental Health", "Climate", "Education", "Fashion", "Sports", "Food"];
  const trendingReels = Array(6).fill(null).map((_, i) => ({
    id: `trending-${i}`,
    title: `Trending Reel ${i + 1}`,
    username: `user${i + 1}`,
    likes: Math.floor(Math.random() * 10000),
    views: Math.floor(Math.random() * 100000),
    coverImage: `https://picsum.photos/seed/${i + 100}/300/400`,
  }));
  
  const communities = Array(8).fill(null).map((_, i) => ({
    id: `community-${i}`,
    name: `Community ${i + 1}`,
    members: Math.floor(Math.random() * 10000),
    description: `This is community ${i + 1} description`,
    coverImage: `https://picsum.photos/seed/${i + 200}/300/200`,
  }));

  const creators = Array(10).fill(null).map((_, i) => ({
    id: `creator-${i}`,
    name: `Creator ${i + 1}`,
    username: `creator${i + 1}`,
    followers: Math.floor(Math.random() * 50000),
    avatar: `https://picsum.photos/seed/${i + 300}/200/200`,
  }));

  const featuredReels = Array(8).fill(null).map((_, i) => ({
    id: `featured-${i}`,
    title: `Featured Reel ${i + 1}`,
    username: `user${i + 1}`,
    likes: Math.floor(Math.random() * 5000),
    views: Math.floor(Math.random() * 50000),
    coverImage: `https://picsum.photos/seed/${i + 400}/300/400`,
  }));

  return (
    <AppLayout pageTitle="Explore">
      <div className="mb-20">
        {/* Search Section */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b">
          {showSearch ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search for creators, communities, or topics..." 
                className="pl-10 pr-10 py-6 rounded-full focus-visible:ring-unmute-purple/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearch(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Explore</h1>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="mt-4 overflow-x-auto flex gap-2 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className={`rounded-full px-4 py-2 flex-shrink-0 text-sm ${
                category === "All" ? "bg-unmute-purple text-white" : ""
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Trending Section */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-unmute-pink mr-1" />
              <h2 className="text-lg font-semibold">Trending Now</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-unmute-purple">
              See all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {trendingReels.slice(0, isMobile ? 4 : 6).map((reel) => (
              <TrendingReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        </section>

        {/* Communities Section */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-unmute-purple mr-1" />
              <h2 className="text-lg font-semibold">Communities For You</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-unmute-purple">
              Explore all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {communities.map((community) => (
                <CarouselItem key={community.id} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <CommunityCard community={community} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </section>

        {/* Creators You'll Love */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Creators You'll Love</h2>
            <Button variant="ghost" size="sm" className="text-unmute-purple">
              See all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="overflow-x-auto flex gap-3 pb-2 scrollbar-hide">
            {creators.map((creator) => (
              <CreatorProfileCard key={creator.id} creator={creator} />
            ))}
          </div>
        </section>

        {/* Featured Reels Section */}
        <section className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Video className="h-5 w-5 text-unmute-blue mr-1" />
              <h2 className="text-lg font-semibold">Featured Reels</h2>
            </div>
          </div>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="recommended">For You</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {featuredReels.map((reel) => (
                  <TrendingReelCard key={reel.id} reel={reel} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="trending">
              <div className="min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">Trending content coming soon</p>
              </div>
            </TabsContent>
            <TabsContent value="recommended">
              <div className="min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">Personalized recommendations coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Trending Hashtags */}
        <section className="mt-8 mb-12">
          <div className="flex items-center mb-3">
            <Hash className="h-5 w-5 text-unmute-pink mr-1" />
            <h2 className="text-lg font-semibold">Trending Hashtags</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["#ClimateAction", "#MentalHealthMatters", "#NewMusic", "#SocialJustice", "#DigitalRights", 
              "#CreativeCoding", "#ArtivistMovement"].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                className="rounded-full text-xs bg-gray-50 hover:bg-unmute-purple/10 hover:text-unmute-purple"
              >
                {tag}
              </Button>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default ExplorePage;
