
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause } from 'lucide-react';
import { JournalEntry } from './types';

interface RecordingSectionProps {
  onSaveRecording: (entry: JournalEntry) => void;
}

const RecordingSection: React.FC<RecordingSectionProps> = ({ onSaveRecording }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setRecordedAudio(audioBlob);
        
        // In a real application, this would be a call to a transcription service
        // For demo purposes, we'll just use a placeholder
        simulateTranscription();
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
      });
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const playRecording = () => {
    if (recordedAudio && audioRef.current) {
      const audioUrl = URL.createObjectURL(recordedAudio);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };
  
  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const simulateTranscription = () => {
    // In a real app, this would come from a transcription service
    const dummyTranscriptions = [
      "Today I'm feeling a bit overwhelmed with all my responsibilities, but I'm trying to take it one step at a time.",
      "I had a really good conversation with my friend today that helped me feel more centered and understood.",
      "I'm noticing that I need to set better boundaries with my work time. I keep working late and it's affecting my sleep.",
      "I'm proud of myself for taking time for self-care today, even though my schedule was packed.",
      "I'm feeling anxious about my upcoming presentation, but I know I've prepared well and I'm capable."
    ];
    
    const randomIndex = Math.floor(Math.random() * dummyTranscriptions.length);
    setTranscription(dummyTranscriptions[randomIndex]);
  };
  
  const handleSave = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      duration: formatTime(recordingTime),
      transcription: transcription
    };
    
    onSaveRecording(newEntry);
    
    // Reset state
    setRecordedAudio(null);
    setTranscription('');
    setRecordingTime(0);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Record Your Thoughts</CardTitle>
        <CardDescription>
          Speak freely to express how you're feeling. Your audio will stay private.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          {isRecording ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                <Mic className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-xl font-mono">{formatTime(recordingTime)}</div>
              <p className="text-sm text-muted-foreground">Recording...</p>
            </div>
          ) : recordedAudio ? (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="flex items-center justify-center gap-4">
                {isPlaying ? (
                  <Button 
                    onClick={pauseRecording} 
                    variant="outline" 
                    size="icon"
                    className="h-12 w-12 rounded-full"
                  >
                    <Pause className="h-6 w-6" />
                  </Button>
                ) : (
                  <Button 
                    onClick={playRecording} 
                    variant="outline" 
                    size="icon"
                    className="h-12 w-12 rounded-full"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Duration: {formatTime(recordingTime)}</p>
              <audio ref={audioRef} className="hidden" />
              
              {transcription && (
                <div className="w-full mt-4">
                  <p className="text-sm font-medium mb-2">Transcription</p>
                  <div className="p-3 bg-white border rounded-lg">
                    <p className="text-sm">{transcription}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Button 
                onClick={startRecording} 
                variant="outline" 
                size="icon"
                className="h-16 w-16 rounded-full"
              >
                <Mic className="h-8 w-8 text-[#9b87f5]" />
              </Button>
              <p className="text-sm text-muted-foreground">Tap to start recording</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isRecording ? (
          <Button 
            onClick={stopRecording} 
            variant="destructive"
            className="w-full"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        ) : recordedAudio ? (
          <div className="flex w-full gap-2">
            <Button 
              onClick={startRecording} 
              variant="outline"
              className="flex-1"
            >
              Record New
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-[#9b87f5] hover:bg-[#7E69AB]"
            >
              Save Entry
            </Button>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default RecordingSection;
