
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Video, PenTool, ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface FirstUnmuteStepProps {
  onNext: () => void;
  onUpdateData: (data: any) => void;
  data: any;
}

const FirstUnmuteStep = ({ onNext, onUpdateData, data }: FirstUnmuteStepProps) => {
  const [unmuteMedium, setUnmuteMedium] = useState<"audio" | "video" | "text" | null>(
    data?.medium || null
  );
  const [textContent, setTextContent] = useState(data?.content || "");
  const [isComplete, setIsComplete] = useState(false);
  
  const handleSkip = () => {
    onUpdateData({ firstUnmute: null });
    onNext();
  };
  
  const handleSubmitText = () => {
    if (textContent.trim()) {
      onUpdateData({ 
        firstUnmute: { 
          medium: "text", 
          content: textContent,
          timestamp: new Date().toISOString()
        }
      });
      setIsComplete(true);
      setTimeout(() => onNext(), 1500);
    }
  };
  
  const handleSelectMedium = (medium: "audio" | "video" | "text") => {
    setUnmuteMedium(medium);
    
    // For audio/video, we would typically record here
    // For this demo, we'll just simulate it and move forward after selection
    if (medium === "audio" || medium === "video") {
      onUpdateData({ 
        firstUnmute: { 
          medium, 
          content: `Sample ${medium} content`,
          timestamp: new Date().toISOString()
        }
      });
      setIsComplete(true);
      setTimeout(() => onNext(), 1500);
    }
  };
  
  return (
    <div className="flex flex-col flex-grow items-center justify-center p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Make Your First Unmute</h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Want to share something right now?
      </p>
      
      {!unmuteMedium ? (
        <div className="w-full max-w-md">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => handleSelectMedium("audio")}
              className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-unmute-purple transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-unmute-purple/10 flex items-center justify-center mb-2">
                <Mic className="h-6 w-6 text-unmute-purple" />
              </div>
              <span className="text-sm">Audio</span>
            </button>
            
            <button
              onClick={() => handleSelectMedium("video")}
              className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-unmute-purple transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-unmute-purple/10 flex items-center justify-center mb-2">
                <Video className="h-6 w-6 text-unmute-purple" />
              </div>
              <span className="text-sm">Video</span>
            </button>
            
            <button
              onClick={() => handleSelectMedium("text")}
              className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-unmute-purple transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-unmute-purple/10 flex items-center justify-center mb-2">
                <PenTool className="h-6 w-6 text-unmute-purple" />
              </div>
              <span className="text-sm">Text</span>
            </button>
          </div>
          
          <div className="text-center">
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="text-gray-500"
            >
              Skip for now
            </Button>
          </div>
        </div>
      ) : unmuteMedium === "text" ? (
        <div className="w-full max-w-md">
          <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[150px] mb-6"
          />
          
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitText}
              className="unmute-primary-button"
              disabled={!textContent.trim()}
            >
              Share <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : isComplete ? (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-medium">Your {unmuteMedium} has been shared!</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-unmute-purple/10 flex items-center justify-center animate-pulse">
            {unmuteMedium === "audio" ? (
              <Mic className="h-8 w-8 text-unmute-purple" />
            ) : (
              <Video className="h-8 w-8 text-unmute-purple" />
            )}
          </div>
          <p className="text-lg">Preparing {unmuteMedium} capture...</p>
        </div>
      )}
    </div>
  );
};

export default FirstUnmuteStep;
