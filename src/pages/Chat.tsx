
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChatProvider } from "@/contexts/ChatContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatConversation from "@/components/chat/ChatConversation";
import ChatInput from "@/components/chat/ChatInput";
import WelcomeScreen from "@/components/chat/WelcomeScreen";
import { useChatContext } from "@/contexts/ChatContext";

interface ChatProps {
  chatId?: string;
}

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
      </div>
    </div>
  );
};

const Chat: React.FC<ChatProps> = ({ chatId }) => {
  return (
    <ChatProvider chatId={chatId}>
      <ChatContent />
    </ChatProvider>
  );
};

export default Chat;
