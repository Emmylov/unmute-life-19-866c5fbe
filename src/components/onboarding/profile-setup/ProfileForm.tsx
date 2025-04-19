
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ColorSelector from "./ColorSelector";

interface ProfileFormProps {
  username: string;
  bio: string;
  selectedColor: string;
  onUsernameChange: (username: string) => void;
  onBioChange: (bio: string) => void;
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
    <div className="space-y-6 w-full">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="username"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="border-gray-300 focus:border-unmute-purple"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          className="border-gray-300 focus:border-unmute-purple min-h-[120px]"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Select a profile theme color</p>
        <ColorSelector
          selectedColor={selectedColor}
          onColorSelect={onColorSelect}
          colorOptions={[
            "unmute-purple", 
            "unmute-pink", 
            "unmute-blue", 
            "unmute-green"
          ]}
        />
      </div>
    </div>
  );
};

export default ProfileForm;
