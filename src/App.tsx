
import React from "react";
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

// Toast provider
import { Toaster } from "sonner";

// Auth provider
import { AuthProvider } from "./contexts/AuthContext";

// Helper component to handle chat with ID
function ChatWithId() {
  const { id } = useParams();
  return <Chat chatId={id} />;
}

// Helper component to handle reels with query parameters
function ReelsWithParams() {
  const [searchParams] = useSearchParams();
  const reelId = searchParams.get('reel');
  return <Reels initialReelId={reelId} />;
}

function App() {
  return (
    <React.StrictMode>
      <Router>
        <AuthProvider>
          <div className="w-full">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/help" element={<Help />} />
              
              {/* Protected Routes */}
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
              <Route path="/wellness-plus" element={
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
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </AuthProvider>
      </Router>
    </React.StrictMode>
  );
}

export default App;
