
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase, STORAGE_BUCKETS, getPublicUrl } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import ProfileImageUploader from "./profile-setup/ProfileImageUploader";
import ProfileForm from "./profile-setup/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileSetupStepProps {
  onNext: () => void;
}

const ProfileSetupStep: React.FC<ProfileSetupStepProps> = ({ onNext }) => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-unmute-purple");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, profile, refreshProfile } = useAuth();
  
  // Fetch current user on component mount
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      if (profile.avatar) {
        setPreviewImage(profile.avatar);
      }
    }
  }, [profile]);
  
  const handleImageChange = (imageUrl: string | null, file: File | null) => {
    setPreviewImage(imageUrl);
    setImageFile(file);
  };
  
  const saveProfile = async () => {
    if (!user) {
      toast.error("No user logged in");
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload avatar if provided
      let avatarUrl = previewImage;
      if (imageFile) {
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
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKETS.AVATARS)
          .upload(filePath, imageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        avatarUrl = getPublicUrl(STORAGE_BUCKETS.AVATARS, filePath);
      }
      
      // Update the user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          avatar: avatarUrl,
          theme_color: selectedColor.replace('bg-', '')
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Refresh the profile to get the updated data
      await refreshProfile();
      
      toast.success("Profile updated!", {
        description: "Your profile has been set up successfully.",
      });
      
      // Allow a moment for the toast to be shown before proceeding
      setTimeout(() => {
        onNext();
      }, 800);
      
    } catch (error: any) {
      toast.error("Error saving profile", {
        description: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Profile Setup</h2>
      
      <div className="flex justify-center mb-6">
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
      
      <div className="mt-auto">
        <Button
          onClick={saveProfile}
          className="unmute-primary-button w-full"
          disabled={!username || loading}
        >
          {loading ? "Saving..." : "Done!"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetupStep;
