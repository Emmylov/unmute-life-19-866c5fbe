
import React from "react";
import GoodieCard from "./GoodieCard";
import { Gift, BookOpen, Music, Award } from "lucide-react";

interface StarterPackSectionProps {
  className?: string;
}

const StarterPackSection = ({ className }: StarterPackSectionProps) => {
  return (
    <section className={`bg-white/50 py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          OG Starter Pack Goodies
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <GoodieCard 
            icon={<Gift className="h-8 w-8 text-unmute-purple" />}
            title="Custom Wallpaper"
            description="Exclusive phone & desktop designs"
          />
          
          <GoodieCard 
            icon={<BookOpen className="h-8 w-8 text-unmute-pink" />}
            title="Digital Guidebook"
            description="Wellness tips & platform secrets"
          />
          
          <GoodieCard 
            icon={<Music className="h-8 w-8 text-unmute-blue" />}
            title="Focus Playlist"
            description="Curated tracks for mindfulness"
          />
          
          <GoodieCard 
            icon={<Award className="h-8 w-8 text-unmute-lavender" />}
            title="OG Badge"
            description="Lifetime profile verification"
          />
        </div>
      </div>
    </section>
  );
};

export default StarterPackSection;
