
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase, STORAGE_BUCKETS, getPublicUrl } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface ProfileSetupStepProps {
  onNext: () => void;
}

const themeColors = [
  { name: "Purple", value: "bg-unmute-purple" },
  { name: "Pink", value: "bg-unmute-pink" },
  { name: "Coral", value: "bg-unmute-coral" },
  { name: "Teal", value: "bg-unmute-teal" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
];

const ProfileSetupStep = ({ onNext }: ProfileSetupStepProps) => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [selectedColor, setSelectedColor] = useState(themeColors[0].value);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  
  // Fetch current user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(session.user);
        
        // Check if user already has profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, bio, avatar')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUsername(profile.username || '');
          setBio(profile.bio || '');
          if (profile.avatar) {
            setPreviewImage(profile.avatar);
          }
        }
      }
    };
    
    fetchUser();
  }, []);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const saveProfile = async () => {
    if (!currentUser) return;
    
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
        const filePath = `${currentUser.id}/${fileName}`;
        
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
          theme_color: selectedColor.replace('bg-', ''),
          is_onboarded: true
        })
        .eq('id', currentUser.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Profile updated!",
        description: "Your profile has been set up successfully.",
      });
      
      onNext();
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Profile Setup</h2>
      
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${
            previewImage ? "" : "border-2 border-dashed border-gray-300 bg-gray-50"
          }`}>
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <label
            htmlFor="profile-upload"
            className="absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-unmute-purple text-white cursor-pointer"
          >
            <Camera className="h-4 w-4" />
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>
      
      <div className="space-y-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Write a short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Select a profile theme color</Label>
          <div className="flex flex-wrap gap-3">
            {themeColors.map((color) => (
              <button
                key={color.value}
                className={`w-8 h-8 rounded-full ${color.value} transition-all ${
                  selectedColor === color.value
                    ? "ring-2 ring-offset-2 ring-unmute-purple"
                    : ""
                }`}
                onClick={() => setSelectedColor(color.value)}
                aria-label={`Select ${color.name} theme`}
              />
            ))}
          </div>
        </div>
      </div>
      
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
