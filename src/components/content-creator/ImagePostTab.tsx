
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/content-creator/TagInput";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Globe, Users, Lock, Upload, Plus, X, Trash2, Grid3x3, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface ImagePostTabProps {
  onSuccess: () => void;
}

const ImagePostTab: React.FC<ImagePostTabProps> = ({ onSuccess }) => {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState("public");
  const [layout, setLayout] = useState("single");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Check file size (5MB limit per image)
      const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024);
      
      if (validFiles.length < newFiles.length) {
        alert("Some files were too large. Maximum size per image is 5MB.");
      }
      
      // Limit to 10 images total
      const totalFiles = [...images, ...validFiles];
      if (totalFiles.length > 10) {
        alert("You can only upload a maximum of 10 images.");
        setImages(totalFiles.slice(0, 10));
      } else {
        setImages(totalFiles);
      }
    }
    
    // Reset the input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (isDraft = false) => {
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      
      // Upload images to Supabase Storage
      const imageUrls = [];
      const storagePaths = [];
      
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const uploadOptions = {
          cacheControl: '3600'
        };
        
        // Track upload progress separately
        const { data, error } = await supabase.storage
          .from('posts')
          .upload(filePath, file, uploadOptions);
        
        // Update progress after upload completes or fails
        setUploadProgress(prev => ({
          ...prev,
          [i]: error ? 0 : 100
        }));
        
        if (error) {
          console.error("Error uploading image:", error);
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);
          
        imageUrls.push(publicUrl);
        storagePaths.push(filePath);
      }
      
      // Save post data to Supabase
      const postData = {
        user_id: user.id,
        content: caption,
        image_url: imageUrls[0], // Primary image
        storage_path: storagePaths.join(','),
        cause: tags.join(','),
        visibility: isDraft ? "draft" : visibility,
        layout: layout,
        // Store additional image URLs as needed
      };
      
      const { error } = await supabase.from('posts').insert(postData);
      
      if (error) {
        console.error("Error creating post:", error);
        return;
      }
      
      // Reset form
      setCaption("");
      setImages([]);
      setTags([]);
      setVisibility("public");
      setLayout("single");
      setUploadProgress({});
      
      if (!isDraft) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error in submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col md:flex-row gap-8"
    >
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <Label>Upload Images (max 10)</Label>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              images.length === 0 ? "border-muted-foreground/20" : "border-primary/20"
            }`}
          >
            {images.length === 0 ? (
              <div className="flex flex-col items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Click to upload or drag images here</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Max 10 images, 5MB each</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button 
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1
                          opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="bg-white rounded-md px-2 py-1 text-xs">
                            {Math.round(uploadProgress[index])}%
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Add more images button */}
                  {images.length < 10 && (
                    <div 
                      className="border-2 border-dashed border-muted-foreground/20 rounded-md
                        flex items-center justify-center cursor-pointer aspect-square"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <input 
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </>
            )}
            
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="caption">Caption</Label>
          <Textarea 
            id="caption" 
            placeholder="Write a caption for your images..." 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[100px]"
            maxLength={300}
          />
          <div className="text-xs text-right text-muted-foreground">
            {caption.length}/300
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Tags</Label>
          <TagInput 
            tags={tags}
            setTags={setTags} 
          />
        </div>
      </div>
      
      <div className="md:w-[280px] space-y-6">
        <div className="p-4 rounded-lg bg-muted/50 border">
          <h3 className="font-semibold mb-4">Layout</h3>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setLayout("single")}
              className={`flex flex-col items-center p-2 rounded-md ${
                layout === "single" ? "bg-primary/20" : "bg-muted"
              }`}
            >
              <ImageIcon className="h-6 w-6 mb-1" />
              <span className="text-xs">Single</span>
            </button>
            <button 
              onClick={() => setLayout("carousel")}
              className={`flex flex-col items-center p-2 rounded-md ${
                layout === "carousel" ? "bg-primary/20" : "bg-muted"
              }`}
            >
              <div className="flex mb-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`h-6 w-1.5 mx-0.5 bg-current rounded-sm ${i === 0 ? "opacity-100" : "opacity-50"}`} />
                ))}
              </div>
              <span className="text-xs">Carousel</span>
            </button>
            <button 
              onClick={() => setLayout("grid")}
              className={`flex flex-col items-center p-2 rounded-md ${
                layout === "grid" ? "bg-primary/20" : "bg-muted"
              }`}
            >
              <Grid3x3 className="h-6 w-6 mb-1" />
              <span className="text-xs">Grid</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Tabs defaultValue="public" value={visibility} onValueChange={setVisibility}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="public" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </TabsTrigger>
                <TabsTrigger value="friends" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Friends
                </TabsTrigger>
                <TabsTrigger value="private" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting || images.length === 0}
            >
              Save as Draft
            </Button>
            <Button 
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || images.length === 0}
              className="relative overflow-hidden"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin mr-1">⏳</span> Posting...
                </span>
              ) : "Post Images"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImagePostTab;
