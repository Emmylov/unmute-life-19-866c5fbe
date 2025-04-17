import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MusicPlayer, { Track } from './MusicPlayer';
import { motion } from 'framer-motion';
import { Music, Headphones, TrendingUp, Clock, Heart } from 'lucide-react';
import { formatTime } from '@/utils/format-utils';

// Sample data - in a real app, this would come from an API
const sampleTracks: Track[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    artist: 'Zen Garden',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=easy-lifestyle-137766.mp3',
    coverArt: 'https://images.unsplash.com/photo-1519834879210-84589adfb8d6?q=80&w=300',
    duration: 184
  },
  {
    id: '2',
    title: 'Focus Flow',
    artist: 'Ambient Works',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0fd2b9ce8.mp3?filename=relaxing-145038.mp3',
    coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=300',
    duration: 215
  },
  {
    id: '3',
    title: 'Calm Waters',
    artist: 'Nature Sounds',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_00278c5092.mp3?filename=relaxing-mountains-rivers-birds-126532.mp3',
    coverArt: 'https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=300',
    duration: 246
  },
  {
    id: '4',
    title: 'Positive Energy',
    artist: 'Mood Lifters',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/30/audio_200a31f733.mp3?filename=relaxing-145972.mp3',
    coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=300',
    duration: 195
  },
  {
    id: '5',
    title: 'Sunset Vibes',
    artist: 'Chill Mode',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/12/15/audio_c3fb654ada.mp3?filename=lofi-chill-medium-version-159456.mp3',
    coverArt: 'https://images.unsplash.com/photo-1483086431886-3590a88317fe?q=80&w=300',
    duration: 172
  }
];

interface MusicCategoryProps {
  title: string;
  icon: React.ReactNode;
  tracks: Track[];
}

const MusicCategory: React.FC<MusicCategoryProps> = ({ title, icon, tracks }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map(track => (
          <motion.div
            key={track.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square relative">
              <img
                src={track.coverArt}
                alt={track.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-bold truncate">{track.title}</h3>
                  <p className="text-sm opacity-90 truncate">{track.artist}</p>
                </div>
              </div>
              <div className="absolute top-3 right-3 flex space-x-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/90 rounded-full p-2 shadow-md text-rose-500"
                >
                  <Heart className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MusicSection: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<Track>(sampleTracks[0]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-full">
          <Music className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Music</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="featured">
            <TabsList className="mb-4">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="meditation">Meditation</TabsTrigger>
              <TabsTrigger value="focus">Focus</TabsTrigger>
              <TabsTrigger value="energy">Energy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="featured" className="space-y-8">
              <MusicCategory 
                title="Staff Picks" 
                icon={<Headphones className="h-5 w-5 text-primary" />} 
                tracks={sampleTracks.slice(0, 3)} 
              />
              <MusicCategory 
                title="Trending Now" 
                icon={<TrendingUp className="h-5 w-5 text-primary" />} 
                tracks={sampleTracks.slice(2, 5)} 
              />
            </TabsContent>
            
            <TabsContent value="meditation">
              <MusicCategory 
                title="Meditation Sounds" 
                icon={<Clock className="h-5 w-5 text-primary" />} 
                tracks={[sampleTracks[0], sampleTracks[2], sampleTracks[4]]} 
              />
            </TabsContent>
            
            <TabsContent value="focus">
              <MusicCategory 
                title="Focus Enhancers" 
                icon={<Clock className="h-5 w-5 text-primary" />} 
                tracks={[sampleTracks[1], sampleTracks[3], sampleTracks[2]]} 
              />
            </TabsContent>
            
            <TabsContent value="energy">
              <MusicCategory 
                title="Energy Boosters" 
                icon={<Heart className="h-5 w-5 text-primary" />} 
                tracks={[sampleTracks[3], sampleTracks[4], sampleTracks[1]]} 
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:row-start-1">
          <h2 className="font-semibold mb-4">Now Playing</h2>
          <MusicPlayer tracks={sampleTracks} />
          
          <div className="mt-6 bg-card rounded-xl p-4">
            <h3 className="font-medium mb-3">Up Next</h3>
            <div className="space-y-2">
              {sampleTracks.map((track, index) => (
                <motion.div 
                  key={track.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer"
                  onClick={() => setActiveTrack(track)}
                >
                  <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 rounded overflow-hidden">
                    <img 
                      src={track.coverArt}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(track.duration)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicSection;
