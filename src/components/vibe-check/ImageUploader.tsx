
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onImageUploaded: (url: string | null) => void;
  imageUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded, imageUrl }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Create a URL for the image
    const reader = new FileReader();
    reader.onload = () => {
      // In a real app, we would upload to storage here
      // For now, we'll just use the data URL
      setIsUploading(false);
      if (typeof reader.result === 'string') {
        onImageUploaded(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    onImageUploaded(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {imageUrl ? (
        <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="w-full h-auto max-h-[300px] object-contain"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          onClick={triggerFileInput}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <ImageIcon className="h-8 w-8" />
              </div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Upload an image</p>
              <p className="text-sm text-gray-500 text-center max-w-[250px]">
                Share a selfie, photo, or any image that represents how you're feeling
              </p>
              <Button variant="outline" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Choose file
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
