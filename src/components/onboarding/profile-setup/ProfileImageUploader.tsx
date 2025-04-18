
import React, { useState } from "react";
import { Camera, User } from "lucide-react";

interface ProfileImageUploaderProps {
  initialImage: string | null;
  onImageChange: (imageUrl: string | null, file: File | null) => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  initialImage,
  onImageChange,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(initialImage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setPreviewImage(preview);
        onImageChange(preview, file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <div className={`w-28 h-28 sm:w-24 sm:h-24 rounded-full flex items-center justify-center overflow-hidden ${
        previewImage ? "" : "border-2 border-dashed border-gray-300 bg-gray-50"
      }`}>
        {previewImage ? (
          <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="h-14 w-14 sm:h-12 sm:w-12 text-gray-400" />
        )}
      </div>
      <label
        htmlFor="profile-upload"
        className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-unmute-purple text-white cursor-pointer"
      >
        <Camera className="h-5 w-5 sm:h-4 sm:w-4" />
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>
    </div>
  );
};

export default ProfileImageUploader;
