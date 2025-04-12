
import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useChatContext } from "@/contexts/ChatContext";

const ChatConversation = () => {
  const { messages, currentUserId, profiles, isTyping, getChatPartner } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Properly handle chat partner retrieval by ensuring getChatPartner is a function
  const chatPartner = typeof getChatPartner === 'function' ? getChatPartner() : null;

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get the current chat partner's messages if chatId is available
  const currentMessages = Array.isArray(messages[chatPartner?.id || '']) ? messages[chatPartner?.id || ''] : [];

  return (
    <div className="flex-grow p-4 overflow-y-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-3xl mx-auto space-y-4">
        {currentMessages.map((msg) => (
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
