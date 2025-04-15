import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Heart, BookOpen, Headphones, MessageCircle, Users, Calendar, Dumbbell } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-responsive";
import AppLayout from '@/components/layout/AppLayout';
import DailyCheckIn from '@/components/wellness-plus/DailyCheckIn';
import AudioJournal from '@/components/wellness-plus/AudioJournal';
import ResourceLibrary from '@/components/wellness-plus/ResourceLibrary';
import SupportCircles from '@/components/wellness-plus/SupportCircles';
import AnonymousSupport from '@/components/wellness-plus/AnonymousSupport';
import PhysicalWellnessHub from '@/components/wellness-plus/physical-wellness/PhysicalWellnessHub';

const WellnessPlus = () => {
  const isMobile = useIsMobile();

  return (
    <AppLayout pageTitle="Wellness+">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 max-w-7xl">
        {/* Header with navigation back to regular wellness page */}
        <div className="flex items-center mb-4 md:mb-6">
          <Link to="/wellness" className="flex items-center text-gray-600 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 mr-1" />
            <span className="text-sm sm:text-base">Back to Wellness</span>
          </Link>
        </div>
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#E5DEFF] to-[#FDE1D3] p-4 sm:p-6 lg:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="md:w-3/4 space-y-2 md:space-y-4 z-10">
              <span className="inline-block px-2 md:px-3 py-0.5 md:py-1 bg-white/70 rounded-full text-xs md:text-sm font-medium text-purple-800">
                Unmute Wellness+
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">
                Your safe space for emotional & mental wellbeing
              </h1>
              <p className="text-sm sm:text-base text-slate-700">
                A private sanctuary for reflection, support, and growth. Track your moods, journal your thoughts, and connect with supportive circles.
              </p>
            </div>
            <div className="md:w-1/4 flex justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src="/lovable-uploads/f55055fc-5460-456c-acf2-f6fbd2695ac5.png"
                  alt="Chioma Iyayi"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#D6BCFA]/30 opacity-60 z-0"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#FDE1D3]/50 opacity-60 z-0"></div>
        </div>
        
        {/* Main Tabs for Wellness+ Features */}
        <Tabs defaultValue="daily-check-in" className="space-y-4 md:space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide">
            <TabsTrigger value="daily-check-in" className="flex gap-2 whitespace-nowrap">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Daily Check-In</span>
              <span className="sm:hidden">Daily</span>
            </TabsTrigger>
            <TabsTrigger value="audio-journal" className="flex gap-2 whitespace-nowrap">
              <Headphones className="h-4 w-4" />
              <span className="hidden sm:inline">Audio Journal</span>
              <span className="sm:hidden">Audio</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex gap-2 whitespace-nowrap">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Resource Library</span>
              <span className="sm:hidden">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="support-circles" className="flex gap-2 whitespace-nowrap">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Support Circles</span>
              <span className="sm:hidden">Circles</span>
            </TabsTrigger>
            <TabsTrigger value="let-it-out" className="flex gap-2 whitespace-nowrap">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Let It Out</span>
              <span className="sm:hidden">Share</span>
            </TabsTrigger>
            <TabsTrigger value="physical-wellness" className="flex gap-2 whitespace-nowrap">
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Physical Wellness</span>
              <span className="sm:hidden">Physical</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily-check-in">
            <DailyCheckIn />
          </TabsContent>
          
          <TabsContent value="audio-journal">
            <AudioJournal />
          </TabsContent>
          
          <TabsContent value="resources">
            <ResourceLibrary />
          </TabsContent>
          
          <TabsContent value="support-circles">
            <SupportCircles />
          </TabsContent>
          
          <TabsContent value="let-it-out">
            <AnonymousSupport />
          </TabsContent>
          
          <TabsContent value="physical-wellness">
            <PhysicalWellnessHub />
          </TabsContent>
        </Tabs>

        {/* Add padding at bottom for mobile view to account for bottom navigation */}
        {isMobile && <div className="h-16"></div>}
      </div>
    </AppLayout>
  );
};

export default WellnessPlus;
