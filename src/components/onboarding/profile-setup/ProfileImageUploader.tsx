
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
      <div className={`w-32 h-32 sm:w-28 sm:h-28 rounded-full flex items-center justify-center overflow-hidden ${
        previewImage ? "" : "border-2 border-dashed border-gray-300 bg-gray-50"
      }`}>
        {previewImage ? (
          <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="h-16 w-16 sm:h-14 sm:w-14 text-gray-400" />
        )}
      </div>
      <label
        htmlFor="profile-upload"
        className="absolute -bottom-2 -right-2 w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-unmute-purple text-white cursor-pointer shadow-md"
      >
        <Camera className="h-6 w-6 sm:h-5 sm:w-5" />
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
