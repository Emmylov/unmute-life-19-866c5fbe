
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Play } from 'lucide-react';
import { JournalEntry } from './types';

interface JournalEntryListProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const JournalEntryList = ({ entries, onSelectEntry }: JournalEntryListProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Previous Entries</CardTitle>
        <CardDescription>
          Your audio journal history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {entries.map(entry => (
            <li 
              key={entry.id} 
              className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded"
              onClick={() => onSelectEntry(entry)}
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
  );
};

export default JournalEntryList;
