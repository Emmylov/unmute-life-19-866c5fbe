
import React, { useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileImageUploaderProps {
  initialImage: string | null;
  onImageChange: (imageUrl: string | null, file: File | null) => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  initialImage,
  onImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage);

  useEffect(() => {
    if (initialImage) {
      setPreviewUrl(initialImage);
    }
  }, [initialImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onImageChange(result, file);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      <Avatar 
        className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-md cursor-pointer group"
        onClick={handleClick}
      >
        <AvatarImage src={previewUrl || undefined} alt="Profile picture" />
        <AvatarFallback className="bg-unmute-purple text-white text-3xl">
          {previewUrl ? "" : "U"}
        </AvatarFallback>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
          <Camera className="h-8 w-8 text-white" />
        </div>
      </Avatar>
      
      <div
        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200"
        onClick={handleClick}
      >
        <Camera className="h-4 w-4 text-gray-600" />
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ProfileImageUploader;
