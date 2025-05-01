
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import { fetchUserProfile, checkIsFollowing, toggleFollowUser } from '@/integrations/supabase/profile-functions';
import { Button } from "@/components/ui/button";
import { UserCircle, Edit, Calendar, Link as LinkIcon, MapPin } from "lucide-react";
import AppLayout from '@/components/layout/AppLayout';
import PostCard from '@/components/home/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getFormattedDate } from '@/utils/format-utils';
import { toast } from "sonner";
import ProfileReactions from '@/components/profile/ProfileReactions';
import useFeed from '@/hooks/feed/use-feed';
import { ErrorDisplay } from '@/components/ui/error-display';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Use the userId from the profile once loaded for feed
  const { posts, loading: postsLoading, error: postsError, refresh: refreshPosts, networkError } = 
    useFeed({ userId: profile?.id, limit: 20 });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setLoadError(null);
      
      try {
        // Use username from URL or current user's ID
        const userId = username || (user ? user.id : null);
        
        if (!userId) {
          setLoadError("No user specified");
          setLoading(false);
          return;
        }
        
        console.log(`Loading profile for: ${userId}`);
        const profileData = await fetchUserProfile(userId);
        
        if (!profileData) {
          setLoadError("Profile not found");
          setLoading(false);
          return;
        }
        
        setProfile(profileData);
        
        // Check if this is the current user's profile
        const isOwn = user && (user.id === profileData.id);
        setIsCurrentUser(isOwn);
        
        // Check if the current user is following this profile
        if (user && !isOwn && profileData.id) {
          const followStatus = await checkIsFollowing(user.id, profileData.id);
          setIsFollowing(followStatus);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setLoadError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [username, user]);
  
  const handleFollowToggle = async () => {
    if (!user || !profile) return;
    
    try {
      const newFollowingStatus = await toggleFollowUser(user.id, profile.id);
      setIsFollowing(newFollowingStatus);
      
      toast.success(newFollowingStatus 
        ? `You are now following ${profile.username || 'this user'}` 
        : `You unfollowed ${profile.username || 'this user'}`);
    } catch (error) {
      console.error("Error toggling follow status:", error);
      toast.error("Failed to update follow status");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container max-w-4xl py-6">
          <ProfileSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (loadError || !profile) {
    return (
      <AppLayout>
        <div className="container max-w-4xl py-6">
          <ErrorDisplay 
            title="Could not load profile" 
            description={loadError || "The profile you're looking for doesn't exist"}
            action={<Button onClick={() => window.location.reload()}>Retry</Button>}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Helmet>
        <title>{profile.username ? `${profile.username} | Unmute` : 'Profile | Unmute'}</title>
      </Helmet>
      
      <div className="container max-w-4xl py-6">
        <div className="bg-card rounded-xl p-6 shadow-sm">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-primary">
                {profile.avatar ? (
                  <AvatarImage src={profile.avatar} alt={profile.username || 'Profile'} />
                ) : (
                  <AvatarFallback>
                    <UserCircle className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              {/* Theme color indicator */}
              {profile.theme_color && (
                <div 
                  className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-background" 
                  style={{ backgroundColor: profile.theme_color }}
                />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-semibold mb-1">{profile.full_name || profile.username || 'User'}</h1>
              
              {profile.username && (
                <p className="text-muted-foreground mb-4">@{profile.username}</p>
              )}
              
              {profile.bio && (
                <p className="mb-4 max-w-prose">{profile.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground mb-4">
                {profile.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {getFormattedDate(profile.created_at)}</span>
                  </div>
                )}
                
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a 
                      href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 justify-center md:justify-start text-sm mt-2">
                <div>
                  <span className="font-semibold">{profile.following || 0}</span> Following
                </div>
                <div>
                  <span className="font-semibold">{profile.followers || 0}</span> Followers
                </div>
              </div>
            </div>
            
            <div>
              {isCurrentUser ? (
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button 
                    onClick={handleFollowToggle}
                    variant={isFollowing ? "outline" : "default"}
                    className="w-full"
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                  
                  <ProfileReactions userId={profile.id} />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            {postsLoading ? (
              <div className="space-y-4">
                <PostSkeleton />
                <PostSkeleton />
              </div>
            ) : posts && posts.length > 0 ? (
              <>
                {/* Retry button if we had network errors */}
                {networkError && (
                  <div className="mb-4 text-center">
                    <Button variant="outline" size="sm" onClick={refreshPosts}>
                      Retry loading posts
                    </Button>
                  </div>
                )}
                
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </>
            ) : (
              <EmptyState 
                title="No posts yet"
                description={
                  isCurrentUser 
                    ? "Share your first post with the community!"
                    : `${profile.username || 'This user'} hasn't posted anything yet.`
                }
              />
            )}
            
            {postsError && !networkError && (
              <div className="mt-4 p-4 border rounded-lg bg-red-50 text-red-600">
                <p>Error loading posts. Please try again later.</p>
              </div>  
            )}
          </TabsContent>
          
          <TabsContent value="media">
            <EmptyState 
              title="No media yet"
              description={
                isCurrentUser 
                  ? "Share photos and videos with the community!"
                  : `${profile.username || 'This user'} hasn't shared any media yet.`
              }
            />
          </TabsContent>
          
          <TabsContent value="likes">
            <EmptyState 
              title="No likes yet"
              description={
                isCurrentUser 
                  ? "Posts you like will appear here."
                  : `${profile.username || 'This user'} hasn't liked any posts yet.`
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Profile skeleton component for loading state
const ProfileSkeleton = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
        
        <div className="flex-1 text-center md:text-left">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-16 w-full max-w-md mb-4" />
          
          <div className="flex gap-4 justify-center md:justify-start">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        
        <div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
};

// Post skeleton component for loading state
const PostSkeleton = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm">
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-24 w-full mb-4" />
      <div className="flex gap-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {/* Icon could be added here */}
        <span className="text-4xl">📝</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Profile;
