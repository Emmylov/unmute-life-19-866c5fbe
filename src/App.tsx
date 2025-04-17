import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useParams, useSearchParams } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Explore from "./pages/Explore";
import Wellness from "./pages/Wellness";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import ContentCreator from "./pages/ContentCreator";
import Reels from "./pages/Reels";
import VibeCheck from "./pages/VibeCheck";
import WellnessPlus from "./pages/WellnessPlus";
import CreateCollab from "./pages/CreateCollab";
import Notifications from "./pages/Notifications";
import Communities from "./pages/Communities";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Saved from "./pages/Saved";
import "./App.css";
import ProtectedLayout from "./components/auth/ProtectedLayout";
import ErrorBoundary from "./components/ui/error-boundary";
import Games from "./pages/Games";
import MemoryMatch from "./pages/games/MemoryMatch";
import WordScramble from "./pages/games/WordScramble";
import BubblePop from "./pages/games/BubblePop";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { supabase } from "./integrations/supabase/client";
import { differenceInHours } from "date-fns";
import DailyRewardModal from "./components/rewards/DailyRewardModal";

interface UserSettings {
  settings: {
    rewards?: {
      lastClaimed?: string;
    }
  }
}

function ChatWithId() {
  const { id } = useParams();
  return <Chat chatId={id} />;
}

function ReelsWithParams() {
  const [searchParams] = useSearchParams();
  const reelId = searchParams.get('reel');
  return <Reels initialReelId={reelId} />;
}

function App() {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkDailyRewardStatus();
    }
  }, [user]);

  const checkDailyRewardStatus = async () => {
    if (!user) return;

    try {
      const { data: userSettings } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();

      const settings = userSettings?.settings as UserSettings['settings'] || {};
      const now = new Date();
      const lastClaimed = settings?.rewards?.lastClaimed 
        ? new Date(settings.rewards.lastClaimed)
        : null;
      
      if (!lastClaimed || (differenceInHours(now, lastClaimed) >= 24 && !sessionStorage.getItem('rewardCheckDone'))) {
        setTimeout(() => setShowRewardModal(true), 2000);
      }

      sessionStorage.setItem('rewardCheckDone', 'true');
    } catch (error) {
      console.error("Error checking reward status:", error);
    }
  };

  return (
    <React.StrictMode>
      <Router>
        <AuthProvider>
          <ErrorBoundary>
            <div className="w-full">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/help" element={<Help />} />
                
                <Route path="/home" element={
                  <ProtectedLayout>
                    <Home />
                  </ProtectedLayout>
                } />
                <Route path="/profile" element={
                  <ProtectedLayout>
                    <Profile />
                  </ProtectedLayout>
                } />
                <Route path="/chat" element={
                  <ProtectedLayout>
                    <Chat />
                  </ProtectedLayout>
                } />
                <Route path="/chat/:id" element={
                  <ProtectedLayout>
                    <ChatWithId />
                  </ProtectedLayout>
                } />
                <Route path="/explore" element={
                  <ProtectedLayout>
                    <Explore />
                  </ProtectedLayout>
                } />
                <Route path="/communities" element={
                  <ProtectedLayout>
                    <Communities />
                  </ProtectedLayout>
                } />
                <Route path="/wellness" element={
                  <ProtectedLayout>
                    <Wellness />
                  </ProtectedLayout>
                } />
                <Route path="/wellness/plus" element={
                  <ProtectedLayout>
                    <WellnessPlus />
                  </ProtectedLayout>
                } />
                <Route path="/create" element={
                  <ProtectedLayout>
                    <ContentCreator />
                  </ProtectedLayout>
                } />
                <Route path="/create-collab" element={
                  <ProtectedLayout>
                    <CreateCollab />
                  </ProtectedLayout>
                } />
                <Route path="/reels" element={
                  <ProtectedLayout>
                    <ReelsWithParams />
                  </ProtectedLayout>
                } />
                <Route path="/vibe-check" element={
                  <ProtectedLayout>
                    <VibeCheck />
                  </ProtectedLayout>
                } />
                <Route path="/notifications" element={
                  <ProtectedLayout>
                    <Notifications />
                  </ProtectedLayout>
                } />
                <Route path="/settings" element={
                  <ProtectedLayout>
                    <Settings />
                  </ProtectedLayout>
                } />
                <Route path="/saved" element={
                  <ProtectedLayout>
                    <Saved />
                  </ProtectedLayout>
                } />
                <Route path="/games" element={
                  <ProtectedLayout>
                    <Games />
                  </ProtectedLayout>
                } />
                <Route path="/games/memory" element={
                  <ProtectedLayout>
                    <MemoryMatch />
                  </ProtectedLayout>
                } />
                <Route path="/games/word-scramble" element={
                  <ProtectedLayout>
                    <WordScramble />
                  </ProtectedLayout>
                } />
                <Route path="/games/bubble-pop" element={
                  <ProtectedLayout>
                    <BubblePop />
                  </ProtectedLayout>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster position="top-right" />
              <DailyRewardModal open={showRewardModal} onOpenChange={setShowRewardModal} />
            </div>
          </ErrorBoundary>
        </AuthProvider>
      </Router>
    </React.StrictMode>
  );
}

export default App;
