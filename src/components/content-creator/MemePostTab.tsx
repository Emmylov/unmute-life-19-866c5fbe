
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorPicker } from "@/components/content-creator/ColorPicker";
import { Upload, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface MemePostTabProps {
  onSuccess: () => void;
}

const MemePostTab: React.FC<MemePostTabProps> = ({ onSuccess }) => {
  const [memeImage, setMemeImage] = useState<File | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [category, setCategory] = useState("funny");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // For preview image
  const memePreviewUrl = memeImage ? URL.createObjectURL(memeImage) : "";
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMemeImage(e.target.files[0]);
    }
    
    // Reset the input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const generateMemeImage = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas || !memeImage) {
        reject(new Error("Canvas or image not available"));
        return;
      }
  
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
  
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Draw the image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        // Configure text style
        ctx.fillStyle = textColor;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        ctx.font = `bold ${Math.floor(canvas.height / 10)}px Impact, sans-serif`;
  
        // Draw top text
        if (topText) {
          ctx.textBaseline = "top";
          ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
          ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);
        }
  
        // Draw bottom text
        if (bottomText) {
          ctx.textBaseline = "bottom";
          ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
          ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
        }
  
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        }, "image/jpeg", 0.9);
      };
  
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
  
      img.src = memePreviewUrl;
    });
  };
  
  const handleSubmit = async () => {
    if (!memeImage) {
      alert("Please upload an image for your meme.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      
      // Generate the meme image with text overlaid
      const memeBlob = await generateMemeImage();
      const memeFile = new File([memeBlob], "meme.jpg", { type: "image/jpeg" });
      
      // Upload to Supabase Storage
      const fileName = `${uuidv4()}.jpg`;
      const filePath = `${user.id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('posts')
        .upload(filePath, memeFile, {
          onUploadProgress: (progress) => {
            const progressPercent = (progress.loaded / progress.total) * 100;
            setUploadProgress(progressPercent);
          }
        });
      
      if (error) {
        console.error("Error uploading meme:", error);
        return;
      }
      
      // Get public URL of uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);
      
      // Save meme data to Supabase
      const memeData = {
        user_id: user.id,
        image_url: publicUrl,
        storage_path: filePath,
        content: `${topText} ${bottomText}`.trim(),
        cause: category, // Using the cause field for category
      };
      
      const { error: insertError } = await supabase.from('posts').insert(memeData);
      
      if (insertError) {
        console.error("Error creating meme post:", insertError);
        return;
      }
      
      // Reset form
      setMemeImage(null);
      setTopText("");
      setBottomText("");
      setTextColor("#ffffff");
      setCategory("funny");
      setUploadProgress(0);
      
      onSuccess();
    } catch (error) {
      console.error("Error in submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Category options
  const categoryOptions = [
    { value: "funny", label: "Funny" },
    { value: "sarcastic", label: "Sarcastic" },
    { value: "motivational", label: "Motivational" },
    { value: "cringe", label: "Cringe" },
    { value: "political", label: "Political" },
    { value: "wholesome", label: "Wholesome" },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col md:flex-row gap-8"
    >
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <Label>Upload Meme Image</Label>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              !memeImage ? "border-muted-foreground/20" : "border-primary/20"
            }`}
          >
            {!memeImage ? (
              <div className="flex flex-col items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Click to upload a meme template image</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-full max-w-md mx-auto">
                  <img 
                    src={memePreviewUrl} 
                    alt="Meme preview" 
                    className="w-full h-auto rounded-lg"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="absolute top-2 right-2" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" /> Change
                  </Button>
                </div>
              </div>
            )}
            
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="topText">Top Text</Label>
            <Input 
              id="topText" 
              placeholder="TOP TEXT" 
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bottomText">Bottom Text</Label>
            <Input 
              id="bottomText" 
              placeholder="BOTTOM TEXT" 
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <ColorPicker 
              color={textColor}
              onChange={setTextColor}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={setCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="md:w-[280px] space-y-6">
        <div className="p-4 rounded-lg bg-muted/50 border">
          <h3 className="font-semibold mb-4">Meme Preview</h3>
          <div className="bg-gray-800 rounded-lg p-2 relative">
            {memeImage ? (
              <div className="relative">
                <img 
                  src={memePreviewUrl}
                  alt="Meme preview" 
                  className="w-full h-auto rounded-lg"
                />
                
                {topText && (
                  <div 
                    style={{ 
                      position: "absolute", 
                      top: "10px", 
                      left: 0, 
                      width: "100%", 
                      textAlign: "center",
                      color: textColor,
                      textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                      fontFamily: "Impact, sans-serif",
                      fontSize: "calc(16px + 2vmin)",
                      fontWeight: "bold"
                    }}
                  >
                    {topText.toUpperCase()}
                  </div>
                )}
                
                {bottomText && (
                  <div 
                    style={{ 
                      position: "absolute", 
                      bottom: "10px", 
                      left: 0, 
                      width: "100%", 
                      textAlign: "center",
                      color: textColor,
                      textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                      fontFamily: "Impact, sans-serif",
                      fontSize: "calc(16px + 2vmin)",
                      fontWeight: "bold"
                    }}
                  >
                    {bottomText.toUpperCase()}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Upload an image to preview your meme</p>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !memeImage}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1">
              <span className="animate-spin mr-1">⏳</span> 
              {uploadProgress > 0 ? `Uploading ${Math.round(uploadProgress)}%` : "Creating meme..."}
            </span>
          ) : "Post Meme"}
        </Button>
      </div>
      
      {/* Hidden canvas used for generating the meme */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </motion.div>
  );
};

export default MemePostTab;
