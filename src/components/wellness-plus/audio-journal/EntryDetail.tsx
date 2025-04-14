
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Play } from 'lucide-react';
import { JournalEntry } from './types';
import { formatDate } from './JournalEntryList';

interface EntryDetailProps {
  entry: JournalEntry | null;
}

const EntryDetail = ({ entry }: EntryDetailProps) => {
  if (!entry) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#F1F0FB] flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-[#9b87f5]"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Select a journal entry</h3>
          <p className="text-muted-foreground">
            Click on one of your previous audio journals to view its details and transcription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Journal Entry</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(entry.date)} • {entry.duration}
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
        {entry.transcription ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Transcription</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm">{entry.transcription}</p>
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
  );
};

export default EntryDetail;
