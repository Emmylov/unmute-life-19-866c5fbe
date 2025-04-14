
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from 'lucide-react';
import { JournalEntry } from './types';

interface RecordingSectionProps {
  onSaveRecording: (entry: JournalEntry) => void;
}

const RecordingSection = ({ onSaveRecording }: RecordingSectionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // In a real app, here we would save the audio recording
      // For now, let's simulate adding a new journal entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date(),
        duration: formatTime(recordingTime),
      };
      
      onSaveRecording(newEntry);
      setRecordingTime(0);
    } else {
      // Start recording
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    setIsRecording(!isRecording);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Journal</CardTitle>
        <CardDescription>
          Record your thoughts, feelings, and reflections
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-8">
        <div 
          className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${
            isRecording 
              ? 'bg-red-50 border-2 border-red-400 animate-pulse' 
              : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <button 
            onClick={toggleRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isRecording 
                ? 'bg-red-500 text-white' 
                : 'bg-[#9b87f5] text-white hover:bg-[#7E69AB]'
            }`}
          >
            {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </button>
        </div>
        
        {isRecording ? (
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">
              {formatTime(recordingTime)}
            </div>
            <div className="text-red-500 text-sm animate-pulse">
              Recording...
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {recordingTime > 0 ? (
              <span>Recording stopped at {formatTime(recordingTime)}</span>
            ) : (
              <span>Tap the mic to start recording</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordingSection;
