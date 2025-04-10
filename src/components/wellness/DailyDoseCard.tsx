
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlayCircle, PauseCircle } from 'lucide-react';

interface DailyDoseProps {
  id: string;
  title: string;
  snippet: string;
  audioUrl: string;
  imageUrl: string;
  date: string;
}

interface DailyDoseCardProps {
  dose: DailyDoseProps;
}

const DailyDoseCard: React.FC<DailyDoseCardProps> = ({ dose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlay = () => {
    // In a real implementation, this would control the audio element
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? "Pausing audio" : "Playing audio", dose.audioUrl);
  };
  
  return (
    <Card className="overflow-hidden border-2 border-[#D6BCFA]/30">
      <div className="flex p-4">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
          <img 
            src={dose.imageUrl} 
            alt="Chioma Iyayi" 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">{dose.title}</h3>
          <p className="text-sm text-muted-foreground">{dose.date}</p>
        </div>
      </div>
      <CardContent className="px-4 pb-2 pt-0">
        <p className="text-sm italic">&ldquo;{dose.snippet}&rdquo;</p>
      </CardContent>
      <CardFooter className="justify-end px-4">
        <button 
          onClick={togglePlay}
          className="text-[#9b87f5] hover:text-[#7E69AB] transition-colors"
        >
          {isPlaying ? (
            <PauseCircle className="h-8 w-8" />
          ) : (
            <PlayCircle className="h-8 w-8" />
          )}
        </button>
      </CardFooter>
    </Card>
  );
};

export default DailyDoseCard;
