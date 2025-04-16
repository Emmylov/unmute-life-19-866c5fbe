
import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ReelWithUser } from '@/types/reels';
import { Play, Volume, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

interface ReelGridProps {
  reels: ReelWithUser[];
  currentIndex: number;
  onSelectReel: (index: number) => void;
}

const ReelGrid: React.FC<ReelGridProps> = ({ reels, currentIndex, onSelectReel }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleReelClick = (index: number) => {
    onSelectReel(index);
  };

  return (
    <div className="w-full px-4 py-6">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {reels.map((reel, index) => (
            <CarouselItem key={reel.reel.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <motion.div
                className={`relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg cursor-pointer border-2 transition-all ${
                  currentIndex === index ? 'border-primary scale-[1.02]' : 'border-transparent'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleReelClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Reel Thumbnail */}
                <img 
                  src={reel.reel.thumbnail_url || 'https://placehold.co/400x600/000000/FFFFFF?text=Reel'} 
                  alt={reel.reel.caption || 'Reel thumbnail'} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50"></div>
                
                {/* Hover overlay with Play button */}
                {hoveredIndex === index && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/20"
                  >
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                    >
                      <Play fill="white" className="h-8 w-8 text-white ml-1" />
                    </motion.div>
                  </motion.div>
                )}
                
                {/* User info */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center">
                  <Avatar className="h-8 w-8 mr-2 border border-white/50">
                    <img 
                      src={reel.user.avatar || 'https://placehold.co/100/000000/FFFFFF?text=User'} 
                      alt={reel.user.username} 
                    />
                  </Avatar>
                  <span className="text-white text-sm font-medium truncate">
                    {reel.user.username || 'User'}
                  </span>
                </div>
                
                {/* Audio indicator */}
                <div className="absolute top-3 right-3">
                  {reel.reel.audio ? (
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                      <Volume className="h-3 w-3 text-white" />
                      <span className="text-white text-xs truncate max-w-[100px]">
                        {reel.reel.audio}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-black/40 backdrop-blur-sm rounded-full p-1">
                      <VolumeX className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                {reel.reel.tags && reel.reel.tags.length > 0 && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-black/40 text-white backdrop-blur-sm text-xs">
                      #{reel.reel.tags[0]}
                    </Badge>
                  </div>
                )}
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </div>
  );
};

export default ReelGrid;
