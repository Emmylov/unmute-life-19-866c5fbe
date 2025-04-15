
export type GenderIdentity = 'male' | 'female' | 'intersex' | 'unsure' | 'prefer_not_to_say';

export interface PhysicalWellnessPreference {
  genderIdentity: GenderIdentity;
  colorTheme?: string;
  softMode?: boolean;
  hideTriggering?: boolean;
}

export interface WellnessSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  forIdentities: GenderIdentity[] | 'all';
}

export interface WellnessContent {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'journal' | 'discussion' | 'tracker';
  thumbnail?: string;
  forIdentities: GenderIdentity[] | 'all';
  tags: string[];
  isPotentiallyTriggering?: boolean;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: Date;
  content: string;
  mood: string;
  bodyFeeling: string;
  isPrivate: boolean;
}

export interface BodyCheckIn {
  id: string;
  userId: string;
  date: Date;
  physicalFeeling: string;
  emotionalFeeling: string;
  notes: string;
}
