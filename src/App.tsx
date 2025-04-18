import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { TutorialProvider } from '@/contexts/TutorialContext';
import TutorialOverlay from '@/components/tutorial/TutorialOverlay';

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Communities from "@/pages/Communities";
import Reels from "@/pages/Reels";
import Chat from "@/pages/Chat";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import Wellness from "@/pages/Wellness";
import WellnessPlus from "@/pages/WellnessPlus";
import Saved from "@/pages/Saved";
import ContentCreator from "@/pages/ContentCreator";
import CreateCollab from "@/pages/CreateCollab";
import VibeCheck from "@/pages/VibeCheck";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Onboarding from "@/pages/Onboarding";
import Games from "@/pages/Games";
import MemoryMatch from "@/pages/games/MemoryMatch";
import BubblePop from "@/pages/games/BubblePop";
import WordScramble from "@/pages/games/WordScramble";
import Music from "@/pages/Music";

function App() {
  useEffect(() => {
    const handleInteraction = () => {
      document.documentElement.setAttribute('data-user-interacted', 'true');
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <TutorialProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />

              <Route element={<ProtectedLayout />}>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/home" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/reels" element={<Reels />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wellness" element={<Wellness />} />
                <Route path="/wellness-plus" element={<WellnessPlus />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/content-creator" element={<ContentCreator />} />
                <Route path="/create-collab" element={<CreateCollab />} />
                <Route path="/vibe-check" element={<VibeCheck />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/games" element={<Games />} />
                <Route path="/games/memory-match" element={<MemoryMatch />} />
                <Route path="/games/bubble-pop" element={<BubblePop />} />
                <Route path="/games/word-scramble" element={<WordScramble />} />
                <Route path="/music" element={<Music />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Tutorial overlay */}
            <TutorialOverlay />
          </TutorialProvider>
          <Toaster position="top-right" closeButton richColors />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
