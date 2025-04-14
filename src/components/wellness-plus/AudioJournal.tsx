
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import RecordingSection from './audio-journal/RecordingSection';
import JournalEntryList from './audio-journal/JournalEntryList';
import EntryDetail from './audio-journal/EntryDetail';
import { JournalEntry } from './audio-journal/types';

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
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const { toast } = useToast();

  const handleSaveRecording = (newEntry: JournalEntry) => {
    setJournalEntries([newEntry, ...journalEntries]);
    
    toast({
      title: "Recording saved",
      description: "Your audio journal entry has been saved",
    });
  };

  const handleEntrySelect = (entry: JournalEntry) => {
    setSelectedEntry(entry);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 lg:w-1/3">
          <RecordingSection onSaveRecording={handleSaveRecording} />
          <JournalEntryList entries={journalEntries} onSelectEntry={handleEntrySelect} />
        </div>
        
        <div className="md:w-1/2 lg:w-2/3">
          <EntryDetail entry={selectedEntry} />
        </div>
      </div>
    </div>
  );
};

export default AudioJournal;
