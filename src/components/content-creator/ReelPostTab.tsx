
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/content-creator/TagInput";
import { FilmIcon, UploadCloud, Music, Volume2, VideoOff, Scissors } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

interface ReelPostTabProps {
  onSuccess: () => void;
}

const ReelPostTab: React.FC<ReelPostTabProps> = ({ onSuccess }) => {
  // Video states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoValid, setVideoValid] = useState(true);
  
  // Audio states
  const [audioType, setAudioType] = useState<"original" | "replaced" | "overlay">("original");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioName, setAudioName] = useState("");
  const [originalVolume, setOriginalVolume] = useState(100);
  const [overlayVolume, setOverlayVolume] = useState(70);
  
  // Content states
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [allowDuets, setAllowDuets] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Audio library options - could fetch from backend
  const audioLibraryOptions = [
    { value: "happy-beats", label: "Happy Beats" },
    { value: "emotional", label: "Emotional Journey" },
    { value: "energetic", label: "Energetic Vibes" },
    { value: "lofi", label: "Lo-Fi Chill" },
    { value: "dramatic", label: "Dramatic Moment" },
  ];
  
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Video file size must be under 100MB.",
          variant: "destructive"
        });
        return;
      }
      
      const url = URL.createObjectURL(file);
      setVideoFile(file);
      setVideoPreviewUrl(url);
      
      // Reset the audio settings when a new video is uploaded
      setAudioType("original");
      
      // Generate thumbnail after video is loaded
      setTimeout(() => {
        generateThumbnail();
      }, 1000);
    }
    
    // Reset the input
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };
  
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setAudioName(file.name.replace(/\.[^/.]+$/, ""));
      setAudioType("overlay");
    }
    
    // Reset the input
    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }
  };
  
  const handleAudioLibrarySelect = (value: string) => {
    // In a real app, you'd fetch the audio file from a backend
    // For now, we'll just set the name
    setAudioName(value);
    setAudioType("replaced");
    setAudioFile(null);
  };
  
  const generateThumbnail = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;
    
    // Seek to 1 second or the middle of the video
    video.currentTime = Math.min(1, video.duration / 2);
    
    // When the video has seeked to the time, draw it to canvas
    const handleSeeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/jpeg");
        setThumbnailPreviewUrl(thumbnailUrl);
      }
      
      video.removeEventListener("seeked", handleSeeked);
    };
    
    video.addEventListener("seeked", handleSeeked);
  };
  
  const getThumbnailBlob = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        reject(new Error("Canvas not available"));
        return;
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert canvas to blob"));
        }
      }, "image/jpeg", 0.9);
    });
  };
  
  // Check video validity when loaded
  const handleVideoLoad = () => {
    const video = videoRef.current;
    if (!video) return;
    
    setVideoDuration(video.duration);
    
    // Check if video meets duration requirements
    const isValidDuration = video.duration >= 3 && video.duration <= 180;
    setVideoValid(isValidDuration);
    
    if (!isValidDuration) {
      toast({
        title: "Invalid video duration",
        description: `Video must be between 3 seconds and 3 minutes. Current duration: ${video.duration.toFixed(1)} seconds.`,
        variant: "destructive"
      });
    }
    
    // Generate thumbnail
    generateThumbnail();
  };
  
  const handleSubmit = async () => {
    if (!videoFile || !videoValid) {
      toast({
        title: "Invalid video",
        description: "Please upload a valid video (3s to 3min).",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Not authenticated",
          description: "Please sign in to post a reel.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Upload video to Supabase Storage
      const videoExt = videoFile.name.split('.').pop();
      const videoFileName = `${uuidv4()}.${videoExt}`;
      const videoFilePath = `${user.id}/${videoFileName}`;
      
      const uploadOptions = {
        cacheControl: '3600'
      };
      
      // Set initial progress
      setUploadProgress(0);
      
      console.log("Uploading video to path:", videoFilePath);
      
      const { data: videoData, error: videoError } = await supabase.storage
        .from('reels')
        .upload(videoFilePath, videoFile, uploadOptions);
      
      // Update progress after upload completes
      setUploadProgress(videoError ? 0 : 100);
      
      if (videoError) {
        console.error("Error uploading video:", videoError);
        toast({
          title: "Upload failed",
          description: `Error uploading video: ${videoError.message}`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log("Video upload successful:", videoData);
      
      // Get video URL
      const { data: { publicUrl: videoPublicUrl } } = supabase.storage
        .from('reels')
        .getPublicUrl(videoFilePath);
      
      console.log("Video public URL:", videoPublicUrl);
      
      // Generate and upload thumbnail
      let thumbnailPublicUrl = "";
      try {
        const thumbnailBlob = await getThumbnailBlob();
        const thumbnailFile = new File([thumbnailBlob], "thumbnail.jpg", { type: "image/jpeg" });
        const thumbnailFileName = `${uuidv4()}-thumb.jpg`;
        const thumbnailFilePath = `${user.id}/${thumbnailFileName}`;
        
        console.log("Uploading thumbnail to path:", thumbnailFilePath);
        
        const { data: thumbnailData, error: thumbnailError } = await supabase.storage
          .from('reels')
          .upload(thumbnailFilePath, thumbnailFile);
        
        if (thumbnailError) {
          console.error("Error uploading thumbnail:", thumbnailError);
          // We continue even if thumbnail upload fails
        } else {
          console.log("Thumbnail upload successful:", thumbnailData);
          // Get thumbnail URL
          const { data: { publicUrl } } = supabase.storage
            .from('reels')
            .getPublicUrl(thumbnailFilePath);
          
          thumbnailPublicUrl = publicUrl;
          console.log("Thumbnail public URL:", thumbnailPublicUrl);
        }
      } catch (thumbnailError) {
        console.error("Error processing thumbnail:", thumbnailError);
        // Continue even if thumbnail generation fails
      }
      
      // Prepare audio data - based on the audioType
      let audioUrl = null;
      if (audioType === "replaced" || audioType === "overlay") {
        // In a real app, you'd handle audio file upload and processing here
        audioUrl = audioName; // For now, just store the name
      }
      
      // Save reel data to Supabase
      const reelData = {
        user_id: user.id,
        video_url: videoPublicUrl,
        thumbnail_url: thumbnailPublicUrl || null,
        caption: caption,
        tags: tags.length > 0 ? tags : null,
        audio: audioName || null,
        audio_type: audioType,
        audio_url: audioUrl,
        original_audio_volume: originalVolume / 100,
        overlay_audio_volume: overlayVolume / 100,
        allow_duets: allowDuets,
        allow_comments: allowComments,
        duration: videoDuration
      };
      
      console.log("Saving reel data:", reelData);
      
      const { error: insertError } = await supabase
        .from('posts_reels')
        .insert(reelData);
      
      if (insertError) {
        console.error("Error creating reel:", insertError);
        toast({
          title: "Error creating reel",
          description: `${insertError.message}`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log("Reel created successfully!");
      
      // Reset form
      setVideoFile(null);
      setVideoPreviewUrl(null);
      setThumbnailPreviewUrl(null);
      setVideoDuration(0);
      setCaption("");
      setTags([]);
      setAudioType("original");
      setAudioFile(null);
      setAudioName("");
      setOriginalVolume(100);
      setOverlayVolume(70);
      setAllowDuets(true);
      setAllowComments(true);
      setUploadProgress(0);
      
      toast({
        title: "Reel created!",
        description: "Your reel has been posted successfully.",
        variant: "default"
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error in submission:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
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
          <Label>Upload Video (3s - 3min, max 100MB)</Label>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              !videoFile ? "border-muted-foreground/20" : "border-primary/20"
            }`}
          >
            {!videoPreviewUrl ? (
              <div className="flex flex-col items-center justify-center cursor-pointer"
                onClick={() => videoInputRef.current?.click()}>
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Click to upload your video</p>
                <p className="text-xs text-muted-foreground/70 mt-1">MP4, MOV, or WebM format recommended</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md">
                  <video 
                    ref={videoRef}
                    src={videoPreviewUrl}
                    className="w-full rounded-lg aspect-[9/16] object-cover"
                    controls
                    onLoadedMetadata={handleVideoLoad}
                  />
                  {!videoValid && (
                    <div className="absolute inset-0 bg-red-900/30 rounded-lg flex items-center justify-center">
                      <p className="text-white text-center px-4 py-2 bg-red-500/80 rounded">
                        Video must be between 3 seconds and 3 minutes
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center mt-4 gap-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    Change Video
                  </Button>
                  {/* Video trim button would go here in a more complete implementation */}
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={true} // Placeholder
                  >
                    <Scissors className="h-4 w-4 mr-1" /> Trim
                  </Button>
                </div>
              </div>
            )}
            
            <input 
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            {videoDuration > 0 && (
              <span>Duration: {Math.floor(videoDuration / 60)}m {Math.round(videoDuration % 60)}s</span>
            )}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="caption">Caption</Label>
          <Textarea 
            id="caption" 
            placeholder="Write a caption for your reel..." 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Tags</Label>
          <TagInput 
            tags={tags}
            setTags={setTags} 
            placeholder="Add tags like #trending #unmute"
          />
        </div>
      </div>
      
      <div className="md:w-[280px] space-y-6">
        {/* Audio Options */}
        <div className="p-4 rounded-lg bg-muted/50 border">
          <h3 className="font-semibold mb-4">
            <Music className="h-4 w-4 inline mr-2" />
            Audio Options
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="original-audio"
                checked={audioType === "original"}
                onChange={() => setAudioType("original")}
              />
              <Label htmlFor="original-audio">Keep Original Audio</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="replace-audio"
                checked={audioType === "replaced"}
                onChange={() => setAudioType("replaced")}
              />
              <Label htmlFor="replace-audio">Replace Audio</Label>
            </div>
            
            {audioType === "replaced" && (
              <Select onValueChange={handleAudioLibrarySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audio from library" />
                </SelectTrigger>
                <SelectContent>
                  {audioLibraryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="overlay-audio"
                checked={audioType === "overlay"}
                onChange={() => setAudioType("overlay")}
              />
              <Label htmlFor="overlay-audio">Overlay Audio</Label>
            </div>
            
            {audioType === "overlay" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => audioInputRef.current?.click()}
              >
                <UploadCloud className="h-4 w-4 mr-2" />
                Upload Audio File
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </Button>
            )}
            
            {audioFile && (
              <p className="text-xs text-muted-foreground">
                {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)}MB)
              </p>
            )}
            
            {(audioType === "overlay" || audioType === "replaced") && audioName && (
              <p className="text-sm font-medium">
                Using: {audioName}
              </p>
            )}
            
            {audioType === "overlay" && videoPreviewUrl && (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="original-volume" className="text-xs">
                      <Volume2 className="h-3 w-3 inline mr-1" /> Original Volume
                    </Label>
                    <span className="text-xs">{originalVolume}%</span>
                  </div>
                  <Slider
                    id="original-volume"
                    min={0}
                    max={100}
                    step={1}
                    value={[originalVolume]}
                    onValueChange={(values) => setOriginalVolume(values[0])}
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="overlay-volume" className="text-xs">
                      <Music className="h-3 w-3 inline mr-1" /> Overlay Volume
                    </Label>
                    <span className="text-xs">{overlayVolume}%</span>
                  </div>
                  <Slider
                    id="overlay-volume"
                    min={0}
                    max={100}
                    step={1}
                    value={[overlayVolume]}
                    onValueChange={(values) => setOverlayVolume(values[0])}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Settings and permissions */}
        <div className="p-4 rounded-lg bg-muted/50 border">
          <h3 className="font-semibold mb-4">Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-duets">Allow Duets</Label>
              <Switch
                id="allow-duets"
                checked={allowDuets}
                onCheckedChange={setAllowDuets}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-comments">Allow Comments</Label>
              <Switch
                id="allow-comments"
                checked={allowComments}
                onCheckedChange={setAllowComments}
              />
            </div>
          </div>
        </div>
        
        {/* Thumbnail preview */}
        {thumbnailPreviewUrl && (
          <div className="p-4 rounded-lg bg-muted/50 border">
            <h3 className="font-semibold mb-4">Thumbnail</h3>
            <img 
              src={thumbnailPreviewUrl} 
              alt="Video thumbnail"
              className="w-full aspect-[9/16] object-cover rounded-lg"
            />
          </div>
        )}
        
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !videoFile || !videoValid}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1">
              <span className="animate-spin mr-1">⏳</span> 
              {uploadProgress > 0 ? `Uploading ${Math.round(uploadProgress)}%` : "Processing..."}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <FilmIcon className="h-4 w-4 mr-1" /> Post Reel
            </span>
          )}
        </Button>
      </div>
      
      {/* Hidden canvas for thumbnail generation */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </motion.div>
  );
};

export default ReelPostTab;
