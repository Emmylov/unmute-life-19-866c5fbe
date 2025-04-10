
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart, BookOpen, Headphones, MessageCircle, Users, Calendar } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import DailyCheckIn from '@/components/wellness-plus/DailyCheckIn';
import AudioJournal from '@/components/wellness-plus/AudioJournal';
import ResourceLibrary from '@/components/wellness-plus/ResourceLibrary';
import SupportCircles from '@/components/wellness-plus/SupportCircles';
import AnonymousSupport from '@/components/wellness-plus/AnonymousSupport';

const WellnessPlus = () => {
  return (
    <AppLayout pageTitle="Wellness+">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header with navigation back to regular wellness page */}
        <div className="flex items-center mb-6">
          <Link to="/wellness" className="flex items-center text-gray-600 hover:text-primary transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back to Wellness</span>
          </Link>
        </div>
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#E5DEFF] to-[#FDE1D3] p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-3/4 space-y-4 z-10">
              <span className="inline-block px-3 py-1 bg-white/70 rounded-full text-sm font-medium text-purple-800">
                Unmute Wellness+
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Your safe space for emotional & mental wellbeing
              </h1>
              <p className="text-slate-700">
                A private sanctuary for reflection, support, and growth. Track your moods, journal your thoughts, and connect with supportive circles.
              </p>
            </div>
            <div className="md:w-1/4 flex justify-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
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
        <Tabs defaultValue="daily-check-in" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="daily-check-in" className="flex gap-2">
              <Heart className="h-4 w-4" />
              Daily Check-In
            </TabsTrigger>
            <TabsTrigger value="audio-journal" className="flex gap-2">
              <Headphones className="h-4 w-4" />
              Audio Journal
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex gap-2">
              <BookOpen className="h-4 w-4" />
              Resource Library
            </TabsTrigger>
            <TabsTrigger value="support-circles" className="flex gap-2">
              <Users className="h-4 w-4" />
              Support Circles
            </TabsTrigger>
            <TabsTrigger value="let-it-out" className="flex gap-2">
              <MessageCircle className="h-4 w-4" />
              Let It Out
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
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default WellnessPlus;
