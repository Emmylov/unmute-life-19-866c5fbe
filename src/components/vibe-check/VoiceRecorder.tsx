
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause, Loader2, Trash2 } from "lucide-react";

interface VoiceRecorderProps {
  onRecordingComplete: (url: string | null) => void;
  audioUrl: string | null;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, audioUrl }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "recorded" | "playing">("idle");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        onRecordingComplete(url);
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingState("recording");
      
      // Start recording timer
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingState("recorded");
      
      // Clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setRecordingState("recorded");
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setRecordingState("playing");
    }
  };

  const handleDelete = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onRecordingComplete(null);
    setIsPlaying(false);
    setRecordingTime(0);
    setRecordingState("idle");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      {audioUrl ? (
        <div className="w-full space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              className={`h-12 w-12 rounded-full ${isPlaying ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {recordingState === "playing" ? "Playing..." : "Recording saved"}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              className="h-10 w-10 rounded-full text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <audio 
            ref={audioRef} 
            src={audioUrl} 
            onEnded={() => {
              setIsPlaying(false);
              setRecordingState("recorded");
            }} 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={`h-16 w-16 rounded-full ${isRecording ? 'bg-red-500' : 'bg-primary'}`}
            >
              {isRecording ? (
                <Square className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            
            <div className="text-center">
              {recordingState === "recording" ? (
                <div className="flex items-center space-x-2 text-red-500">
                  <span className="animate-pulse">●</span>
                  <span>Recording... {formatTime(recordingTime)}</span>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Tap to start recording your thoughts
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
