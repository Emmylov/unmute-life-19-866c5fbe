
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase, STORAGE_BUCKETS, getPublicUrl } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import ProfileImageUploader from "./ProfileImageUploader";
import ProfileForm from "./ProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-responsive";

interface ProfileSetupStepProps {
  onNext: () => void;
}

const ProfileSetupStep: React.FC<ProfileSetupStepProps> = ({ onNext }) => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [selectedColor, setSelectedColor] = useState("unmute-purple");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, profile, refreshProfile } = useAuth();
  const isMobile = useIsMobile();
  
  // Fetch current user on component mount
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      if (profile.avatar) {
        setPreviewImage(profile.avatar);
      }
      if (profile.theme_color) {
        setSelectedColor(profile.theme_color);
      }
    }
  }, [profile]);
  
  const handleImageChange = (imageUrl: string | null, file: File | null) => {
    setPreviewImage(imageUrl);
    setImageFile(file);
  };
  
  const saveProfile = async () => {
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        toast.error("No user logged in", { 
          description: "Please sign in to continue with onboarding." 
        });
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // Upload avatar if provided
      let avatarUrl = previewImage;
      if (imageFile) {
        try {
          // Create avatars bucket if it doesn't exist yet
          const { data: buckets } = await supabase.storage.listBuckets();
          if (!buckets?.find(bucket => bucket.name === STORAGE_BUCKETS.AVATARS)) {
            await supabase.storage.createBucket(STORAGE_BUCKETS.AVATARS, {
              public: true,
            });
          }
          
          // Upload the avatar
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `${userId}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKETS.AVATARS)
            .upload(filePath, imageFile);
            
          if (uploadError) {
            throw uploadError;
          }
          
          // Get the public URL
          avatarUrl = getPublicUrl(STORAGE_BUCKETS.AVATARS, filePath);
        } catch (error) {
          console.error("Error uploading avatar:", error);
          toast.error("Failed to upload profile image");
          // Continue with profile update even if image upload fails
        }
      }
      
      // Update the user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          avatar: avatarUrl,
          theme_color: selectedColor
        })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      // Refresh the profile to get the updated data
      await refreshProfile();
      
      toast.success("Profile updated!", {
        description: "Your profile has been set up successfully.",
      });
      
      // Allow a moment for the toast to be shown before proceeding
      setTimeout(() => {
        onNext();
      }, 1000);
      
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Error saving profile", {
        description: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col flex-grow p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Profile Setup</h2>
      
      <div className="flex justify-center mb-4 sm:mb-6">
        <ProfileImageUploader 
          initialImage={previewImage}
          onImageChange={handleImageChange}
        />
      </div>
      
      <ProfileForm
        username={username}
        bio={bio}
        selectedColor={selectedColor}
        onUsernameChange={setUsername}
        onBioChange={setBio}
        onColorSelect={setSelectedColor}
      />
      
      <div className="mt-auto pt-4 w-full">
        <Button
          onClick={saveProfile}
          className="unmute-primary-button w-full text-base py-5 sm:py-2"
          disabled={!username || loading}
        >
          {loading ? "Saving..." : "Done!"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetupStep;
