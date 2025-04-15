
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JournalEntry } from './types';
import { formatDistanceToNow } from 'date-fns';

interface JournalEntryListProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
}

const JournalEntryList: React.FC<JournalEntryListProps> = ({ entries, onSelectEntry }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Journal</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No journal entries yet. Start by recording your thoughts.
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectEntry(entry)}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm truncate">
                    {entry.transcription.substring(0, 50)}
                    {entry.transcription.length > 50 ? '...' : ''}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>
                      {formatDistanceToNow(entry.date, { addSuffix: true })}
                    </span>
                    <span className="mx-1">•</span>
                    <span>{entry.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalEntryList;
