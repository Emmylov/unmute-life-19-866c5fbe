
import { supabase } from "@/integrations/supabase/client";
import { PhysicalWellnessPreference } from "@/components/wellness-plus/physical-wellness/types";

// Interface for wellness goals
export interface WellnessGoal {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  category?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  created_at?: string;
}

// Interface for wellness activities
export interface WellnessActivity {
  id?: string;
  user_id: string;
  activity_type: string;
  duration_minutes?: number;
  notes?: string;
  mood_before?: string;
  mood_after?: string;
  created_at?: string;
}

// Interface for journal entries
export interface JournalEntry {
  id?: string;
  user_id: string;
  activity_date?: string;
  sleep_hours?: number;
  water_intake?: number;
  exercise_minutes?: number;
  mood?: string;
  nutrition_rating?: number;
  notes?: string;
  created_at?: string;
}

// Mock data for wellness goals
const mockWellnessGoals: WellnessGoal[] = [
  {
    id: '1',
    user_id: 'user123',
    title: 'Meditate daily',
    description: 'Practice mindfulness for 10 minutes each morning',
    category: 'mental',
    status: 'in_progress',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'user123',
    title: 'Exercise 3 times a week',
    description: 'Complete 30 minutes of moderate exercise',
    category: 'physical',
    status: 'not_started',
    created_at: new Date().toISOString()
  }
];

// Mock data for wellness activities
const mockWellnessActivities: WellnessActivity[] = [
  {
    id: '1',
    user_id: 'user123',
    activity_type: 'meditation',
    duration_minutes: 15,
    mood_before: 'anxious',
    mood_after: 'calm',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'user123',
    activity_type: 'journaling',
    duration_minutes: 20,
    notes: 'Reflected on today\'s achievements',
    created_at: new Date().toISOString()
  }
];

// Wellness tracking functions - using mock implementation for now
export const saveWellnessGoal = async (userId: string, goalData: Partial<WellnessGoal>): Promise<WellnessGoal | null> => {
  try {
    // Mock implementation for now - would connect to Supabase later
    const newGoal: WellnessGoal = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      title: goalData.title || 'Untitled Goal',
      description: goalData.description,
      target_date: goalData.target_date,
      category: goalData.category,
      status: goalData.status || 'not_started',
      created_at: new Date().toISOString()
    };
    
    console.log("Saved wellness goal:", newGoal);
    return newGoal;
  } catch (error) {
    console.error("Error saving wellness goal:", error);
    throw error;
  }
};

export const getWellnessGoals = async (userId: string): Promise<WellnessGoal[]> => {
  try {
    // Mock implementation for now - would connect to Supabase later
    return mockWellnessGoals.filter(goal => goal.user_id === userId);
  } catch (error) {
    console.error("Error getting wellness goals:", error);
    throw error;
  }
};

export const saveWellnessActivity = async (userId: string, activityData: Partial<WellnessActivity>): Promise<WellnessActivity | null> => {
  try {
    // Mock implementation for now - would connect to Supabase later
    const newActivity: WellnessActivity = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      activity_type: activityData.activity_type || 'general',
      duration_minutes: activityData.duration_minutes,
      notes: activityData.notes,
      mood_before: activityData.mood_before,
      mood_after: activityData.mood_after,
      created_at: new Date().toISOString()
    };
    
    console.log("Saved wellness activity:", newActivity);
    return newActivity;
  } catch (error) {
    console.error("Error saving wellness activity:", error);
    throw error;
  }
};

export const getWellnessActivities = async (userId: string): Promise<WellnessActivity[]> => {
  try {
    // Mock implementation for now - would connect to Supabase later
    return mockWellnessActivities.filter(activity => activity.user_id === userId);
  } catch (error) {
    console.error("Error getting wellness activities:", error);
    throw error;
  }
};

// Mock user physical wellness preferences
let mockPhysicalWellnessPreferences: Record<string, PhysicalWellnessPreference> = {};

// Physical wellness functions
export const savePhysicalWellnessPreferences = async (userId: string, preferences: PhysicalWellnessPreference) => {
  try {
    // Store in our mock database
    mockPhysicalWellnessPreferences[userId] = preferences;
    console.log("Saved physical wellness preferences:", preferences);
    return { preferences };
  } catch (error) {
    console.error("Error saving physical wellness preferences:", error);
    throw error;
  }
};

export const getPhysicalWellnessPreferences = async (userId: string): Promise<PhysicalWellnessPreference | null> => {
  try {
    // Get from our mock database
    return mockPhysicalWellnessPreferences[userId] || null;
  } catch (error) {
    console.error("Error getting physical wellness preferences:", error);
    throw error;
  }
};

// Mock journal entries
const mockJournalEntries: JournalEntry[] = [];

export const saveJournalEntry = async (userId: string, entry: Partial<JournalEntry>) => {
  try {
    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      activity_date: entry.activity_date || new Date().toISOString(),
      sleep_hours: entry.sleep_hours,
      water_intake: entry.water_intake,
      exercise_minutes: entry.exercise_minutes,
      mood: entry.mood,
      nutrition_rating: entry.nutrition_rating,
      notes: entry.notes,
      created_at: new Date().toISOString()
    };
    
    mockJournalEntries.push(newEntry);
    console.log("Saved journal entry:", newEntry);
    return [newEntry];
  } catch (error) {
    console.error("Error saving journal entry:", error);
    throw error;
  }
};

export const getJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  try {
    return mockJournalEntries.filter(entry => entry.user_id === userId);
  } catch (error) {
    console.error("Error getting journal entries:", error);
    throw error;
  }
};
