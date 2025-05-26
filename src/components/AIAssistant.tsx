
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIAssistantProps {
  onMessageSend: (message: string) => void;
}

export interface AIAssistantRef {
  addAIMessage: (text: string) => void;
}

const AIAssistant = forwardRef<AIAssistantRef, AIAssistantProps>(({ onMessageSend }, ref) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hello! I'm your Travia AI Assistant for Southeast Asian travel planning. I specialize in Thailand, Singapore, Malaysia, Indonesia, Philippines, and Vietnam - perfect for Middle Eastern travelers! Try saying: 'Create a 7-day trip to Phuket called Paradise Beach for 4 people'",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: chatInput,
      sender: "user",
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    onMessageSend(chatInput);
    setChatInput("");
  };

  const addAIMessage = (text: string) => {
    const aiResponse: ChatMessage = {
      id: Date.now() + 1,
      text,
      sender: "ai",
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, aiResponse]);
  };

  useImperativeHandle(ref, () => ({
    addAIMessage
  }));

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="bg-blue-500 text-white rounded-t-lg">
        <CardTitle className="text-lg flex items-center">
          <div className="w-6 h-6 bg-white rounded mr-2 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
          </div>
          Travia AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Describe the trip you want to plan..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

AIAssistant.displayName = "AIAssistant";

export default AIAssistant;
