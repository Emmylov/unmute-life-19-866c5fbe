
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Video, X, Pause, Smile, VolumeX, Volume2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase, STORAGE_BUCKETS } from "@/integrations/supabase/client";
import { createStory } from "@/integrations/supabase/story-functions";
import { v4 as uuidv4 } from "uuid";

const MOOD_OPTIONS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😎", label: "Cool" },
  { emoji: "😂", label: "Laughing" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😴", label: "Sleepy" },
  { emoji: "🤔", label: "Thinking" },
  { emoji: "😍", label: "Love" },
];

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  profile: any;
}

const StoryModal = ({ isOpen, onClose, onSuccess, profile }: StoryModalProps) => {
  const { toast } = useToast();
  const [mediaType, setMediaType] = useState<"voice" | "video" | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [caption, setCaption] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recordingTimeoutRef = useRef<number | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Reset everything when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetRecording();
      setCaption("");
      setMood(null);
    }
  }, [isOpen]);
  
  const startRecording = async (type: "voice" | "video") => {
    try {
      setMediaType(type);
      const constraints = type === "voice" 
        ? { audio: true } 
        : { audio: true, video: true };
      
      toast({
        title: "Starting recording...",
        description: type === "voice" ? "Voice recording initiated" : "Video recording initiated",
      });
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      
      if (type === "video" && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Avoid feedback
        videoRef.current.play().catch(err => console.error("Error playing video preview:", err));
      }
      
      // Set up correct MIME types for better compatibility
      const mimeType = type === "voice" 
        ? (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4')
        : (MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4');
      
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType,
        audioBitsPerSecond: 128000 // Better audio quality
      });
      
      mediaRecorderRef.current = mediaRecorder;
      mediaChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          mediaChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Determine the correct mime type
        const finalMimeType = type === "voice" ? "audio/webm" : "video/webm";
        const mediaBlob = new Blob(mediaChunksRef.current, { type: finalMimeType });
        
        if (type === "voice" && audioRef.current) {
          const audioURL = URL.createObjectURL(mediaBlob);
          audioRef.current.src = audioURL;
        } else if (type === "video" && videoRef.current) {
          const videoURL = URL.createObjectURL(mediaBlob);
          videoRef.current.srcObject = null;
          videoRef.current.src = videoURL;
          videoRef.current.muted = false;
        }
        
        setRecordingComplete(true);
      };
      
      mediaRecorder.start(1000); // Record in 1-second chunks for better stability
      setIsRecording(true);
      
      // Set a timeout to stop recording after 60 seconds
      recordingTimeoutRef.current = window.setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          stopRecording();
          toast({
            title: "Recording complete",
            description: "Maximum recording time reached (60 seconds)",
          });
        }
      }, 60000);
      
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast({
        title: "Permission Error",
        description: "Could not access your camera or microphone. Please check your device permissions.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      
      toast({
        title: "Recording stopped",
        description: mediaType === "voice" ? "Voice recording completed" : "Video recording completed",
      });
    }
  };
  
  const resetRecording = () => {
    if (audioRef.current) {
      audioRef.current.src = "";
    }
    if (videoRef.current) {
      videoRef.current.src = "";
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject = null;
      }
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    
    setRecordingComplete(false);
    setMediaType(null);
    setIsRecording(false);
    mediaChunksRef.current = [];
  };
  
  const handlePublishStory = async () => {
    if (!mediaChunksRef.current.length || !profile?.id) {
      toast({
        title: "Error",
        description: "No media recorded or user not logged in",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const storyId = uuidv4();
      // Determine the correct mime type and extension
      const mimeType = mediaType === "voice" ? "audio/webm" : "video/webm";
      const extension = "webm";
      const fileName = `${storyId}.${extension}`;
      const filePath = `${profile.id}/${fileName}`;
      
      const mediaBlob = new Blob(mediaChunksRef.current, { type: mimeType });
      
      const { data: fileData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.STORIES)
        .upload(filePath, mediaBlob);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKETS.STORIES)
        .getPublicUrl(filePath);
      
      try {
        await createStory(
          profile.id,
          urlData.publicUrl,
          caption || null,
          mood || null,
          filePath
        );
      } catch (err) {
        console.error("Error using createStory function, falling back to direct insert:", err);
        const { error: insertError } = await (supabase as any)
          .from('stories')
          .insert({
            user_id: profile.id,
            media_url: urlData.publicUrl,
            caption: caption || null,
            mood: mood || null,
            storage_path: filePath
          });
          
        if (insertError) {
          throw insertError;
        }
      }
      
      toast({
        title: "Success",
        description: "Your story has been published!"
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      resetRecording();
      setMood(null);
      setCaption("");
      onClose();
      
    } catch (error) {
      console.error("Error uploading story:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create a Story</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          {!mediaType && !recordingComplete && (
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => startRecording("voice")} 
                variant="outline"
                size="lg"
                className="flex flex-col items-center gap-2 h-auto py-6 px-6"
              >
                <Mic className="h-10 w-10 text-primary" />
                <span>Voice Story</span>
              </Button>
              
              <Button 
                onClick={() => startRecording("video")}
                variant="outline" 
                size="lg"
                className="flex flex-col items-center gap-2 h-auto py-6 px-6"
              >
                <Video className="h-10 w-10 text-primary" />
                <span>Video Story</span>
              </Button>
            </div>
          )}
          
          {mediaType && (
            <div className="w-full">
              <div className="relative flex justify-center">
                {mediaType === "voice" ? (
                  <div className="w-full max-w-xs h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative">
                    <Mic className={`h-12 w-12 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                    <audio ref={audioRef} className="hidden" controls />
                    
                    {recordingComplete && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-12 w-12 rounded-full"
                          onClick={() => {
                            if (audioRef.current) {
                              if (audioRef.current.paused) {
                                audioRef.current.play().catch(err => console.error("Error playing audio:", err));
                              } else {
                                audioRef.current.pause();
                              }
                            }
                          }}
                        >
                          <Mic className="h-6 w-6 text-primary" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-xs relative rounded-lg overflow-hidden">
                    <video 
                      ref={videoRef} 
                      className="w-full aspect-video object-cover bg-gray-100 dark:bg-gray-800 rounded-lg"
                      playsInline
                      muted={!recordingComplete || isMuted}
                      controls={recordingComplete}
                    />
                    
                    {isRecording && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <span className="animate-pulse mr-1">●</span> Recording
                      </div>
                    )}
                    
                    {recordingComplete && (
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full bg-black/50 text-white hover:bg-black/70"
                          onClick={toggleMute}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {!recordingComplete && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0"
                    onClick={resetRecording}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex justify-center mt-4">
                {isRecording ? (
                  <Button 
                    onClick={stopRecording} 
                    variant="destructive"
                    size="sm"
                    className="rounded-full"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Recording
                  </Button>
                ) : !recordingComplete && (
                  <Button 
                    onClick={() => startRecording(mediaType)} 
                    variant="default"
                    size="sm"
                    className="rounded-full"
                  >
                    {mediaType === "voice" ? (
                      <Mic className="h-4 w-4 mr-2" />
                    ) : (
                      <Video className="h-4 w-4 mr-2" />
                    )}
                    Start Recording
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {recordingComplete && (
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Caption (Optional)</label>
                <Input 
                  placeholder="Add a caption to your story..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Mood (Optional)</label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-10 px-4">
                        {mood ? <span className="text-xl mr-2">{mood}</span> : <Smile className="h-5 w-5 mr-2" />}
                        {mood ? "Change mood" : "Add mood"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <div className="grid grid-cols-4 gap-2">
                        {MOOD_OPTIONS.map((option) => (
                          <Button
                            key={option.emoji}
                            variant="ghost"
                            className="h-10 px-0"
                            onClick={() => setMood(option.emoji)}
                          >
                            <span className="text-2xl">{option.emoji}</span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  {mood && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => setMood(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {recordingComplete && (
            <Button 
              onClick={handlePublishStory} 
              disabled={uploading}
            >
              {uploading ? "Publishing..." : "Publish Story"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StoryModal;
