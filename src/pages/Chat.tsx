
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChatProvider } from "@/contexts/ChatContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, Users } from "lucide-react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatConversation from "@/components/chat/ChatConversation";
import ChatInput from "@/components/chat/ChatInput";
import WelcomeScreen from "@/components/chat/WelcomeScreen";
import { useChatContext } from "@/contexts/ChatContext";

const ChatContent = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { getChatPartner, moodStatus, setMoodStatus } = useChatContext();
  const chatPartner = getChatPartner();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile chat navigation */}
      {isMobile && chatId && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-30"
          onClick={() => navigate("/chat")}
          aria-label="Back to chat list"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      
      {/* Chat sidebar */}
      <ChatSidebar isMobile={isMobile} chatId={chatId} />
      
      {/* Main chat area */}
      <div className={`flex-grow flex flex-col ${!chatId && !isMobile ? "items-center justify-center bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10" : ""}`}>
        {!chatId && !isMobile ? (
          <WelcomeScreen />
        ) : chatId ? (
          <>
            {/* Chat header */}
            <ChatHeader
              profile={chatPartner}
              moodStatus={moodStatus}
              setMoodStatus={setMoodStatus}
            />
            
            {/* Chat messages */}
            <ChatConversation />
            
            {/* Chat input */}
            <ChatInput />
          </>
        ) : null}
        
        {/* Empty state for mobile */}
        {isMobile && !chatId && (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <Users className="h-16 w-16 text-unmute-purple/50 mb-4" />
            <h2 className="text-xl font-bold mb-2">Find someone to chat with</h2>
            <p className="text-gray-500 mb-6">Search for users using the search bar above</p>
            <Button onClick={() => {}} className="unmute-primary-button">
              Start a new conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Chat = () => {
  const { chatId } = useParams();
  
  return (
    <ChatProvider chatId={chatId}>
      <ChatContent />
    </ChatProvider>
  );
};

export default Chat;
