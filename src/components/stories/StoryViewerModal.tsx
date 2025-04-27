
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Story } from '@/integrations/supabase/story-functions';
import { viewStory } from '@/integrations/supabase/story-functions';
import { useAuth } from '@/contexts/AuthContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story | null;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const StoryViewerModal = ({
  isOpen,
  onClose,
  story,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false
}: StoryViewerModalProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);

  // Determine the media type
  const isVideo = story?.media_url?.includes("video") || 
                 story?.media_url?.match(/\.(mp4|webm|mov|mkv)$/i) !== null;
  
  const isAudio = story?.media_url?.includes("audio") || 
                 story?.media_url?.match(/\.(mp3|wav|ogg|m4a|aac)$/i) !== null ||
                 (!isVideo && story?.media_url?.endsWith(".webm"));

  useEffect(() => {
    // Reset loading state when story changes
    if (story) {
      setIsLoading(true);
      setProgress(0);
      
      // Record view if user is logged in
      if (user && story.id) {
        viewStory(story.id, user.id).catch(console.error);
      }
    }
  }, [story, user]);

  // Handle media loading and progress updates
  const handleMediaLoad = () => {
    setIsLoading(false);
    if (mediaRef.current) {
      setMediaDuration(mediaRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      const currentProgress = (mediaRef.current.currentTime / mediaRef.current.duration) * 100;
      setProgress(currentProgress);
      
      // Auto-close when media ends
      if (currentProgress >= 99.5 && hasNext) {
        setTimeout(() => onNext?.(), 500);
      } else if (currentProgress >= 99.5 && !hasNext) {
        setTimeout(onClose, 500);
      }
    }
  };

  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!story) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="relative h-[80vh] w-full flex flex-col">
          {/* Header with profile info */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-white">
                <AvatarImage src={story.profiles?.avatar || ''} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {getInitials(story.profiles?.full_name || story.profiles?.username || 'User')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{story.profiles?.username || 'User'}</p>
                <p className="text-xs text-gray-300">
                  {new Date(story.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Close button */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-1 rounded-full bg-black/30 hover:bg-black/50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="absolute top-16 left-0 right-0 z-10 px-4">
            <div className="w-full bg-gray-700/30 h-1 rounded-full">
              <div 
                className="bg-white h-1 rounded-full"
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>

          {/* Media content - centered in the middle */}
          <div className="flex items-center justify-center flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {isVideo ? (
              <video
                ref={mediaRef as React.RefObject<HTMLVideoElement>}
                src={story.media_url}
                className="max-h-full max-w-full object-contain"
                autoPlay
                playsInline
                muted={isMuted}
                onLoadedData={handleMediaLoad}
                onTimeUpdate={handleTimeUpdate}
              />
            ) : isAudio ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
                  <div className={`w-16 h-16 ${isLoading ? '' : 'animate-pulse'}`}>
                    <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18V6L21 12L9 18Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-white">{story.profiles?.username}'s audio story</p>
                <audio
                  ref={mediaRef as React.RefObject<HTMLAudioElement>}
                  src={story.media_url}
                  className="hidden"
                  autoPlay
                  onLoadedData={handleMediaLoad}
                  onTimeUpdate={handleTimeUpdate}
                  muted={isMuted}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center text-center p-4">
                <p>Unsupported media format</p>
              </div>
            )}
          </div>

          {/* Caption if present */}
          {story.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">{story.caption}</p>
              {story.mood && (
                <div className="mt-2 text-xl">{story.mood}</div>
              )}
            </div>
          )}

          {/* Navigation controls */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            {hasPrevious && (
              <button 
                onClick={onPrevious} 
                className="p-2 mx-2 rounded-full bg-black/30 hover:bg-black/50"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            {hasNext && (
              <button 
                onClick={onNext} 
                className="p-2 mx-2 rounded-full bg-black/30 hover:bg-black/50"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryViewerModal;
