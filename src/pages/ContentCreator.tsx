import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, Video, Smile } from "lucide-react";
import TextPostTab from "@/components/content-creator/TextPostTab";
import ImagePostTab from "@/components/content-creator/ImagePostTab";
import ReelPostTab from "@/components/content-creator/ReelPostTab";
import MemePostTab from "@/components/content-creator/MemePostTab";
import SuccessConfetti from "@/components/content-creator/SuccessConfetti";
import AppLayout from "@/components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const ContentCreator = () => {
  const [activeTab, setActiveTab] = useState("text");
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create content",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleSuccessfulPost = (type: string) => {
    setShowConfetti(true);
    
    // Display appropriate toast message
    toast({
      title: "Content created!",
      description: `Your ${type} has been posted successfully!`,
      variant: "default",
    });
    
    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col w-full max-w-5xl mx-auto p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create content</h1>
          <p className="text-muted-foreground text-lg">Share your voice with the world</p>
        </motion.div>
        
        <Tabs 
          defaultValue="text" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full md:w-auto grid grid-cols-4 gap-2 mb-8">
            <TabsTrigger 
              value="text"
              className="flex items-center gap-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Text</span>
            </TabsTrigger>
            <TabsTrigger 
              value="image"
              className="flex items-center gap-2 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30"
            >
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Image</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reel"
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30"
            >
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Reel</span>
            </TabsTrigger>
            <TabsTrigger 
              value="meme"
              className="flex items-center gap-2 data-[state=active]:bg-yellow-100 dark:data-[state=active]:bg-yellow-900/30"
            >
              <Smile className="h-4 w-4" />
              <span className="hidden sm:inline">Meme</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border p-4 md:p-6">
            <TabsContent value="text">
              <TextPostTab onSuccess={() => handleSuccessfulPost("text post")} />
            </TabsContent>
            
            <TabsContent value="image">
              <ImagePostTab onSuccess={() => handleSuccessfulPost("image post")} />
            </TabsContent>
            
            <TabsContent value="reel">
              <ReelPostTab onSuccess={() => handleSuccessfulPost("reel")} />
            </TabsContent>
            
            <TabsContent value="meme">
              <MemePostTab onSuccess={() => handleSuccessfulPost("meme")} />
            </TabsContent>
          </div>
        </Tabs>
        
        {showConfetti && <SuccessConfetti />}
      </div>
    </AppLayout>
  );
};

export default ContentCreator;
