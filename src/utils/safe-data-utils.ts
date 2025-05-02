
/**
 * Utility functions for safely handling data from the database
 * and ensuring type safety throughout the application
 */

// Create a safe profile object with fallbacks
export const createSafeProfile = (profileData: any): {
  id: string;
  username: string | null;
  avatar: string | null;
  full_name: string | null;
} => {
  if (!profileData || typeof profileData !== 'object') {
    return {
      id: '',
      username: null,
      avatar: null,
      full_name: null
    };
  }

  return {
    id: profileData.id || '',
    username: profileData.username || null,
    avatar: profileData.avatar || null,
    full_name: profileData.full_name || null
  };
};

// Safely extract a specific property from an object with a fallback
export function safeGet<T>(obj: any, path: string, fallback: T): T {
  try {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return fallback;
      }
      current = current[part];
    }
    
    return current !== null && current !== undefined ? current : fallback;
  } catch (error) {
    console.warn(`Error accessing path ${path}:`, error);
    return fallback;
  }
}

// Type guard to check if an object has a specific property
export function hasProperty<T, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// Safe data conversion for database responses
export function safeConvert<T>(data: any, defaults: T): T {
  if (!data || typeof data !== 'object') {
    return defaults;
  }
  
  const result = { ...defaults };
  
  for (const key in defaults) {
    if (hasProperty(data, key)) {
      (result as any)[key] = data[key];
    }
  }
  
  return result;
}
