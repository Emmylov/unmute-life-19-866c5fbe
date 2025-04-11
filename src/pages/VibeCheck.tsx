
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MoodSliders from "@/components/vibe-check/MoodSliders";
import JournalingPrompt from "@/components/vibe-check/JournalingPrompt";
import VoiceRecorder from "@/components/vibe-check/VoiceRecorder";
import ImageUploader from "@/components/vibe-check/ImageUploader";
import DrawingCanvas from "@/components/vibe-check/DrawingCanvas";
import VibeCheckSummary from "@/components/vibe-check/VibeCheckSummary";
import { Pencil, Mic, Camera, Loader2, Save } from "lucide-react";

const VibeCheck = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("text");
  const [textReflection, setTextReflection] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [drawingUrl, setDrawingUrl] = useState<string | null>(null);
  const [moodData, setMoodData] = useState({
    mood: 50,
    energy: 50,
    anxiety: 50,
    motivation: 50,
    peace: 50,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, we would save to database here
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setTextReflection("");
    setAudioUrl(null);
    setImageUrl(null);
    setDrawingUrl(null);
    setMoodData({
      mood: 50,
      energy: 50,
      anxiety: 50,
      motivation: 50,
      peace: 50
    });
    setSubmitted(false);
  };

  const handleNewCheck = () => {
    resetForm();
  };

  return (
    <AppLayout pageTitle="Vibe Check">
      <div className="max-w-4xl mx-auto">
        {!submitted ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cosmic-crush">
                Vibe Check
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Check in with yourself and express how you're feeling today.
              </p>
            </div>

            <Card className="mb-8 border-none shadow-lg bg-dream-mist/30">
              <CardContent className="p-5 md:p-6">
                <JournalingPrompt />
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="border-none shadow-md">
                <CardContent className="p-5 md:p-6">
                  <h2 className="text-lg font-medium mb-4">How are you feeling?</h2>
                  <MoodSliders moodData={moodData} setMoodData={setMoodData} />
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-5 md:p-6">
                  <h2 className="text-lg font-medium mb-4">Express yourself</h2>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 md:w-[400px] mb-6">
                      <TabsTrigger value="text" className="flex items-center gap-2">
                        <Pencil className="h-4 w-4" />
                        <span>Write</span>
                      </TabsTrigger>
                      <TabsTrigger value="voice" className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        <span>Voice</span>
                      </TabsTrigger>
                      <TabsTrigger value="visual" className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        <span>Visual</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="text">
                      <Textarea 
                        placeholder="Write your thoughts here..."
                        className="min-h-[150px] focus:border-primary"
                        value={textReflection}
                        onChange={(e) => setTextReflection(e.target.value)}
                      />
                    </TabsContent>

                    <TabsContent value="voice">
                      <VoiceRecorder onRecordingComplete={setAudioUrl} audioUrl={audioUrl} />
                    </TabsContent>

                    <TabsContent value="visual" className="space-y-8">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Upload an image</h3>
                        <ImageUploader onImageUploaded={setImageUrl} imageUrl={imageUrl} />
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Or express with a drawing</h3>
                        <DrawingCanvas onDrawingComplete={setDrawingUrl} drawingUrl={drawingUrl} />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <VibeCheckSummary 
            moodData={moodData}
            textReflection={textReflection}
            audioUrl={audioUrl}
            imageUrl={imageUrl}
            drawingUrl={drawingUrl}
            onNewCheck={handleNewCheck}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default VibeCheck;
