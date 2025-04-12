
import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useChatContext } from "@/contexts/ChatContext";

const ChatConversation = () => {
  const { messages, currentUserId, profiles, isTyping, getChatPartner } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fix: Store the chat partner object directly instead of trying to call getChatPartner as a function
  // The error was that we were trying to call getChatPartner which might not be a function
  const chatPartner = typeof getChatPartner === 'function' ? getChatPartner() : null;

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-grow p-4 overflow-y-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isOwn={msg.sender_id === currentUserId}
            profile={profiles[msg.sender_id]}
          />
        ))}
        {isTyping && chatPartner && (
          <TypingIndicator 
            profile={chatPartner} 
          />
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatConversation;
