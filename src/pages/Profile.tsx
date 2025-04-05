
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Edit2, MessageCircle, Image, Film, User, Users, Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Emoji animation
  const triggerEmojiAnimation = (emoji: string) => {
    if (!currentUser) {
      toast({
        title: "You need to sign in",
        description: "Create an account to react to profiles",
        variant: "default"
      });
      return;
    }
    
    setActiveEmoji(emoji);
    setTimeout(() => setActiveEmoji(null), 1000);
    
    // Here we could save the reaction to Supabase
    toast({
      title: "Reaction sent!",
      description: `You reacted with ${emoji}`,
      variant: "default"
    });
  };
  
  // Check current authenticated user
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Fetch profile data from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        let query;
        if (username) {
          // Fetch by username
          query = supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();
        } else if (currentUser) {
          // Fetch current user's profile
          query = supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
        } else {
          // No username provided and not logged in
          navigate('/');
          return;
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching profile:", error);
          if (error.code === 'PGRST116') {
            // No rows returned - profile not found
            setLoading(false);
            return;
          }
          throw error;
        }
        
        if (data) {
          setProfile(data);
          // Check if this is the current user's profile
          setIsOwnProfile(currentUser && data.id === currentUser.id);
        } else {
          // Fallback to mock data for demo purposes
          // In a production app, you might want to show a "Profile not found" message
          setProfile({
            id: "1",
            username: username || "ella_activist",
            full_name: "Ella Johnson",
            avatar: "",
            bio: "🎤 Teen Activist | 🎨 Artist | ✝️ Jesus lover",
            location: "San Francisco, CA",
            followers: 582,
            following: 231,
            interests: ["Climate Action", "Social Justice", "Art", "Faith"]
          });
          setIsOwnProfile(false);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };
    
    // Only fetch if we have a username or a current user
    if (username || currentUser) {
      fetchProfile();
    }
  }, [username, currentUser, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600 text-center">
          <p className="mb-4">Profile not found</p>
          <Button onClick={() => navigate('/home')} className="unmute-primary-button">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }
  
  // Calculate post counts from profile data or use defaults
  const postCounts = {
    posts: profile.post_count || 0,
    followers: profile.followers || 0,
    following: profile.following || 0,
    communities: profile.communities || 0,
    reels: profile.reel_count || 0
  };
  
  // Handle profile edit
  const handleEditProfile = () => {
    if (!currentUser) {
      toast({
        title: "You need to sign in",
        description: "Create an account to edit your profile",
        variant: "default"
      });
      return;
    }
    
    // Navigate to edit profile page (to be implemented)
    toast({
      title: "Coming Soon!",
      description: "Profile editing will be available soon",
      variant: "default"
    });
  };
  
  // Handle follow action
  const handleFollow = () => {
    if (!currentUser) {
      toast({
        title: "You need to sign in",
        description: "Create an account to follow users",
        variant: "default"
      });
      return;
    }
    
    toast({
      title: "Now following!",
      description: `You are now following ${profile.full_name || profile.username}`,
      variant: "default"
    });
  };
  
  // Handle message action
  const handleMessage = () => {
    if (!currentUser) {
      toast({
        title: "You need to sign in",
        description: "Create an account to message users",
        variant: "default"
      });
      return;
    }
    
    toast({
      title: "Coming Soon!",
      description: "Messaging will be available soon",
      variant: "default"
    });
  };
  
  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={fadeIn}
      className="min-h-screen pb-20"
    >
      {/* Optional Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-unmute-purple/20 via-unmute-coral/20 to-unmute-teal/20 relative">
        {/* Cover photo edit button */}
        {isOwnProfile && (
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-4 bottom-4 bg-white/70 hover:bg-white"
            onClick={handleEditProfile}
          >
            <Image className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Profile Header */}
      <div className="px-4 md:px-8 relative -mt-16 mb-6">
        <motion.div variants={scaleIn} className="flex flex-col md:flex-row items-start md:items-end">
          {/* Profile Picture */}
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white bg-white shadow-md">
              <AvatarImage src={profile.avatar} alt={profile.full_name || profile.username} />
              <AvatarFallback className="bg-unmute-purple text-white text-4xl">
                {profile.full_name?.charAt(0) || profile.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            
            {/* Edit profile picture button */}
            {isOwnProfile && (
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-0 bottom-0 bg-white/70 hover:bg-white rounded-full w-8 h-8"
                onClick={handleEditProfile}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Profile Actions (Follow/Message or Edit) */}
          <div className="mt-4 md:mt-0 md:ml-auto flex space-x-3">
            {isOwnProfile ? (
              <Button className="unmute-secondary-button" onClick={handleEditProfile}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button className="unmute-primary-button" onClick={handleFollow}>
                  Follow
                </Button>
                <Button variant="outline" onClick={handleMessage}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </>
            )}
          </div>
        </motion.div>
        
        {/* Profile Info */}
        <motion.div variants={fadeIn} className="mt-4">
          <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
          <p className="text-gray-600 mb-2">@{profile.username}</p>
          
          {profile.location && (
            <p className="flex items-center text-gray-500 text-sm mb-3">
              <MapPin className="h-3 w-3 mr-1" />
              {profile.location}
            </p>
          )}
          
          <p className="text-gray-800 mb-4">{profile.bio}</p>
          
          {/* User Stats */}
          <div className="flex flex-wrap gap-6 text-sm mb-6">
            <div className="flex flex-col items-center">
              <span className="font-semibold">{postCounts.posts}</span>
              <span className="text-gray-600">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">{postCounts.followers}</span>
              <span className="text-gray-600">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">{postCounts.following}</span>
              <span className="text-gray-600">Following</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">{postCounts.communities}</span>
              <span className="text-gray-600">Communities</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">{postCounts.reels}</span>
              <span className="text-gray-600">Reels</span>
            </div>
          </div>
          
          {/* Emoji Reaction Bar */}
          <Card className="p-3 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              React to {(profile.full_name || profile.username).split(' ')[0]}'s vibe today:
            </p>
            <div className="flex space-x-4">
              {["😍", "🔥", "🤯", "🥹", "👏", "💪"].map((emoji) => (
                <motion.button
                  key={emoji}
                  whileTap={{ scale: 1.5 }}
                  className={`text-2xl transition-transform ${activeEmoji === emoji ? 'scale-150' : ''}`}
                  onClick={() => triggerEmojiAnimation(emoji)}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="px-4 md:px-8">
        <TabsList className="w-full grid grid-cols-5 mb-8">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span className="hidden md:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="reels" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span className="hidden md:inline">Reels</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">About</span>
          </TabsTrigger>
          <TabsTrigger value="communities" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Communities</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            <span className="hidden md:inline">Saved</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
            {[...Array(postCounts.posts || 6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="aspect-square bg-gray-100 rounded-md overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-br from-unmute-purple/20 to-unmute-pink/20 flex items-center justify-center text-gray-400">
                  <Image className="h-8 w-8" />
                </div>
              </motion.div>
            ))}
          </div>
          {postCounts.posts === 0 && (
            <div className="text-center py-8 text-gray-500">
              No posts yet
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reels" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
            {[...Array(postCounts.reels || 0)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="aspect-[9/16] bg-gray-100 rounded-md overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-br from-unmute-coral/20 to-unmute-teal/20 flex items-center justify-center text-gray-400">
                  <Film className="h-8 w-8" />
                </div>
              </motion.div>
            ))}
          </div>
          {postCounts.reels === 0 && (
            <div className="text-center py-8 text-gray-500">
              No reels yet
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="about">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">About {profile.full_name || profile.username}</h3>
            
            {profile.interests && profile.interests.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Passions</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest: string) => (
                    <span 
                      key={interest}
                      className="bg-unmute-purple/10 text-unmute-purple px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Achievements</h4>
              <div className="flex flex-col space-y-2">
                {postCounts.followers >= 500 && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <span className="text-purple-500 text-xs">⭐</span>
                    </div>
                    <span className="text-sm">500+ Followers</span>
                  </div>
                )}
                {postCounts.posts >= 10 && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <span className="text-green-500 text-xs">🏆</span>
                    </div>
                    <span className="text-sm">10+ Posts Created</span>
                  </div>
                )}
                {/* If no achievements, show placeholder */}
                {postCounts.followers < 500 && postCounts.posts < 10 && (
                  <div className="text-sm text-gray-500">
                    No achievements yet. Keep engaging with the community!
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="communities">
          {postCounts.communities > 0 ? (
            <div className="space-y-4">
              {[...Array(postCounts.communities)].map((_, i) => (
                <Card key={i} className="p-4 flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-unmute-purple/30 to-unmute-teal/30 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-unmute-purple" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">Community {i + 1}</h4>
                    <p className="text-sm text-gray-500">234 members</p>
                  </div>
                  <Button variant="outline" size="sm">Join</Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No communities joined yet
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved">
          {isOwnProfile ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-square bg-gray-100 rounded-md overflow-hidden"
                >
                  <div className="w-full h-full bg-gradient-to-br from-unmute-teal/20 to-unmute-pink/20 flex items-center justify-center text-gray-400">
                    <Bookmark className="h-8 w-8" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              This content is private
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Profile;
