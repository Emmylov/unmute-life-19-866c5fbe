
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Calendar } from 'lucide-react';
import { JournalEntry } from './types';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";

interface EntryDetailProps {
  entry: JournalEntry | null;
}

const EntryDetail: React.FC<EntryDetailProps> = ({ entry }) => {
  if (!entry) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-16">
          <p className="text-muted-foreground">
            Select an entry to view details or record a new entry
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Journal Entry</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{format(entry.date, 'PPP')}</span>
          <span className="mx-1">•</span>
          <span>{entry.duration}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          <Button variant="outline" className="flex gap-2 items-center">
            <Play className="h-4 w-4" />
            <span>Play Audio</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Transcription</h3>
            <p className="text-muted-foreground">{entry.transcription}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Reflection Prompts</h3>
            <ul className="space-y-2 text-sm">
              <li className="p-3 bg-gray-50 rounded-lg">
                What emotions were you feeling when you recorded this entry?
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                Is there anything you can do today to address the concerns you expressed?
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                How might you frame this situation differently?
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EntryDetail;
