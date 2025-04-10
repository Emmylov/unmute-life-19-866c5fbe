
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Play, Square, Save, Clock, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  date: Date;
  duration: string;
  transcription?: string;
}

// Sample journal entries for demonstration
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000), // Yesterday
    duration: '1:24',
    transcription: "Today was challenging but I had a breakthrough with my project. I'm feeling proud of myself for persevering."
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    duration: '2:47',
    transcription: "Feeling anxious about the upcoming presentation but I'm reminding myself that I've prepared well and I'm capable."
  }
];

const AudioJournal = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

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
      
      setJournalEntries([newEntry, ...journalEntries]);
      setRecordingTime(0);
      
      toast({
        title: "Recording saved",
        description: "Your audio journal entry has been saved",
      });
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

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleEntrySelect = (entry: JournalEntry) => {
    setSelectedEntry(entry);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 lg:w-1/3">
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
          
          {/* Previous recordings list */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Previous Entries</CardTitle>
              <CardDescription>
                Your audio journal history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {journalEntries.map(entry => (
                  <li 
                    key={entry.id} 
                    className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded"
                    onClick={() => handleEntrySelect(entry)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{formatDate(entry.date)}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {entry.duration}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/2 lg:w-2/3">
          {selectedEntry ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Journal Entry</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedEntry.date)} • {selectedEntry.duration}
                    </div>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedEntry.transcription ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Transcription</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm">{selectedEntry.transcription}</p>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">AI-Generated Reflection</h3>
                      <div className="bg-[#F1F0FB]/50 p-4 rounded-lg border border-[#D6BCFA]/30">
                        <p className="text-sm italic">
                          "It sounds like you're experiencing both challenges and successes. Remember that feeling proud of your perseverance is important - every step forward matters. Your self-awareness about your anxiety and your ability to remind yourself of your capabilities shows emotional intelligence and resilience."
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center flex-col text-center">
                    <p className="text-muted-foreground mb-4">Transcription not available for this entry yet.</p>
                    <Button variant="outline">Generate Transcription</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md p-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#F1F0FB] flex items-center justify-center mb-4">
                  <Mic className="h-8 w-8 text-[#9b87f5]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Select a journal entry</h3>
                <p className="text-muted-foreground">
                  Click on one of your previous audio journals to view its details and transcription.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioJournal;
