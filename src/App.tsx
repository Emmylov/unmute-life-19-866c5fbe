
import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
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
import "./App.css";

// Toast provider
import { Toaster } from "@/components/ui/sonner";

// Auth provider
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<ChatWithId />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/wellness-plus" element={<WellnessPlus />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/create" element={<ContentCreator />} />
            <Route path="/create-collab" element={<CreateCollab />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/vibe-check" element={<VibeCheck />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

// Helper component to handle chat with ID
function ChatWithId() {
  const { id } = useParams();
  return <Chat chatId={id} />;
}

export default App;
