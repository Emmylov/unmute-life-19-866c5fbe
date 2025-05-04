
// Utility function to safely create a profile object
export const createSafeProfile = (profileData: any): {
  id: string;
  username: string | null;
  avatar: string | null;
  full_name: string | null;
} => {
  if (!profileData) {
    return {
      id: '',
      username: null,
      avatar: null,
      full_name: null
    };
  }
  
  return {
    id: profileData?.id || '',
    username: profileData?.username || null,
    avatar: profileData?.avatar || null,
    full_name: profileData?.full_name || null
  };
};
