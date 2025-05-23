
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Mic, MicOff, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

interface ConversationalAgentProps {
  role: "agent" | "traveler" | "vendor";
  apiKey?: string;
}

const ConversationalAgent: React.FC<ConversationalAgentProps> = ({ role, apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(!!apiKey);
  const [apiKeyInput, setApiKeyInput] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting based on role
  useEffect(() => {
    const initialMessage = getInitialMessage(role);
    setMessages([
      { 
        text: initialMessage, 
        sender: "agent", 
        timestamp: new Date() 
      }
    ]);
  }, [role]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getInitialMessage = (role: string) => {
    switch(role) {
      case "agent":
        return "Hello! I'm your Travel Agent Assistant. I can help you create detailed itineraries for your clients and negotiate with vendors.";
      case "traveler":
        return "Welcome! I'm your Travel Companion. I can help you review itineraries, suggest modifications, and research destinations.";
      case "vendor":
        return "Greetings! I'm your Vendor Assistant. I can help you manage service requests and negotiate pricing with travel agents.";
      default:
        return "Hello! How can I assist you with your travel plans today?";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [
      ...prev, 
      { text: input, sender: "user", timestamp: new Date() }
    ]);
    
    setIsProcessing(true);

    // Simulate AI response based on role
    setTimeout(() => {
      const response = getAgentResponse(input, role);
      setMessages(prev => [
        ...prev, 
        { text: response, sender: "agent", timestamp: new Date() }
      ]);
      setIsProcessing(false);
    }, 1500);

    setInput("");
  };

  const getAgentResponse = (input: string, role: string) => {
    // This is a placeholder. In a real implementation, this would call the ElevenLabs API
    const lowercaseInput = input.toLowerCase();
    
    if (role === "agent") {
      if (lowercaseInput.includes("itinerary") || lowercaseInput.includes("create")) {
        return "I can help you create a professional itinerary. What destinations are your clients interested in?";
      } else if (lowercaseInput.includes("price") || lowercaseInput.includes("negotiate")) {
        return "I can assist with vendor negotiations. What specific service are you looking to price?";
      }
    } else if (role === "traveler") {
      if (lowercaseInput.includes("modify") || lowercaseInput.includes("change")) {
        return "I'll help you suggest modifications to your itinerary. What aspects would you like to change?";
      } else if (lowercaseInput.includes("research") || lowercaseInput.includes("information")) {
        return "I can provide information about destinations in your itinerary. Which place would you like to know more about?";
      }
    } else if (role === "vendor") {
      if (lowercaseInput.includes("price") || lowercaseInput.includes("offer")) {
        return "Let's formulate a competitive pricing offer. What service are you providing and what's your typical rate?";
      } else if (lowercaseInput.includes("negotiate") || lowercaseInput.includes("counter")) {
        return "I can help you negotiate with the travel agent. What's your minimum acceptable price for this service?";
      }
    }
    
    return "I understand. How else can I assist you with your travel planning needs?";
  };

  const toggleListening = () => {
    // This is a placeholder for voice input functionality
    // In a real implementation, this would use the browser's Web Speech API
    setIsListening(!isListening);
    if (!isListening) {
      alert("Voice input functionality would be activated here");
      // Simulated voice recognition ending after 3 seconds
      setTimeout(() => {
        setIsListening(false);
        setInput(input + " (voice input simulation)");
      }, 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleSetApiKey = () => {
    if (apiKeyInput.trim()) {
      // In a real implementation, you would store this securely
      // For demo purposes, we're just setting a state variable
      setHasApiKey(true);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!hasApiKey) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connect Your AI Assistant</CardTitle>
          <CardDescription>
            Enter your ElevenLabs API key to activate the conversational agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This feature requires an ElevenLabs API key for voice synthesis and AI conversation capabilities.
            </p>
            <Input
              type="password"
              placeholder="Enter your ElevenLabs API key"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSetApiKey}>
            Connect AI Assistant
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="px-4 py-3 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {role === "agent" ? "Travel Agent Assistant" : 
               role === "traveler" ? "Travel Companion" : "Vendor Assistant"}
            </CardTitle>
            <CardDescription>Your AI travel planning companion</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            AI Assistant
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === "agent" ? (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  <span className="text-xs font-medium">
                    {message.sender === "agent" ? "Assistant" : "You"}
                  </span>
                  <span className="text-xs ml-auto opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleListening}
            className={isListening ? "bg-red-100" : ""}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow"
            disabled={isListening}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ConversationalAgent;
