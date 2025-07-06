
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EnhancedChatInterface from "./EnhancedChatInterface";
import { ItineraryTemplate } from "@/types/templates";

interface AIAssistantCardProps {
  showEnhancedChat: boolean;
  onToggleChat: () => void;
  onTemplateSelect: (template: ItineraryTemplate) => void;
  onMessageSend: (message: string) => void;
  isLoading: boolean;
}

const AIAssistantCard: React.FC<AIAssistantCardProps> = ({
  showEnhancedChat,
  onToggleChat,
  onTemplateSelect,
  onMessageSend,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Travel Assistant</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggleChat}
          >
            {showEnhancedChat ? 'Basic Chat' : 'Enhanced Chat'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showEnhancedChat ? (
          <EnhancedChatInterface
            onTemplateSelect={onTemplateSelect}
            onMessageSend={onMessageSend}
            isLoading={isLoading}
          />
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
              <p className="text-sm text-gray-600">
                Start describing your trip requirements to get personalized recommendations...
              </p>
            </div>
            <div className="flex space-x-2">
              <Input 
                placeholder="Tell me about your trip..."
                className="flex-1"
              />
              <Button>Send</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistantCard;
