
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ColorSelector from "./ColorSelector";

interface ProfileFormProps {
  username: string;
  bio: string;
  selectedColor: string;
  onUsernameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onColorSelect: (color: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  username,
  bio,
  selectedColor,
  onUsernameChange,
  onBioChange,
  onColorSelect,
}) => {
  return (
    <div className="space-y-6 mb-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Write a short bio..."
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Select a profile theme color</Label>
        <ColorSelector 
          selectedColor={selectedColor} 
          onColorSelect={onColorSelect}
        />
      </div>
    </div>
  );
};

export default ProfileForm;
