
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Sparkles, Star, Clock, Users, Target, Lightbulb } from 'lucide-react';
import { templateRecommendationService } from '@/services/templateRecommendationService';
import { ItineraryTemplate } from '@/types/templates';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  templateSuggestion?: string;
}

interface TemplateRecommendation {
  template: ItineraryTemplate;
  confidence: number;
  reason: string;
  contextualNote?: string;
}

interface EnhancedChatInterfaceProps {
  onTemplateSelect: (template: ItineraryTemplate) => void;
  onMessageSend: (message: string) => void;
  isLoading: boolean;
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  onTemplateSelect,
  onMessageSend,
  isLoading
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI travel assistant. Tell me about your trip - destination, duration, group size, or interests - and I'll help you create the perfect itinerary!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [recommendations, setRecommendations] = useState<TemplateRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    // Check for inline template recommendations
    const inlineRecommendation = await templateRecommendationService.getInlineRecommendation(currentMessage);
    
    // Get template recommendations
    const context = await templateRecommendationService.analyzeInput(currentMessage);
    const templateRecs = await templateRecommendationService.getRecommendations(context);

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    if (templateRecs.length > 0) {
      setRecommendations(templateRecs);
      setShowRecommendations(true);
    }

    // Send to parent for processing
    onMessageSend(currentMessage);

    // Add AI response with inline suggestion if available
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: inlineRecommendation || "I'm analyzing your requirements and generating a custom itinerary for you...",
        isUser: false,
        timestamp: new Date(),
        templateSuggestion: inlineRecommendation || undefined
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleTemplateSelect = (recommendation: TemplateRecommendation) => {
    setShowRecommendations(false);
    onTemplateSelect(recommendation.template);
    
    // Add confirmation message
    const confirmMessage: Message = {
      id: Date.now().toString(),
      content: `Great choice! I've loaded the '${recommendation.template.name}' template. This template has a ${recommendation.template.successRate}% success rate and includes ${recommendation.template.activities.length} activities over ${recommendation.template.duration} days. Feel free to ask me to modify anything!`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 60) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border shadow-sm'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.templateSuggestion && (
                <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                  <div className="flex items-center text-xs text-blue-700">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Template Suggestion
                  </div>
                </div>
              )}
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Template Recommendations */}
        {showRecommendations && recommendations.length > 0 && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                Smart Template Recommendations
              </CardTitle>
              <p className="text-sm text-gray-600">
                Based on your requirements, here are our best matching templates:
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((rec, index) => (
                <Card key={rec.template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => handleTemplateSelect(rec)}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{rec.template.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">{rec.template.destination}</p>
                        <p className="text-xs text-gray-500">{rec.reason}</p>
                      </div>
                      <Badge className={getConfidenceColor(rec.confidence)}>
                        {rec.confidence}% match
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {rec.template.duration} days
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        {rec.template.rating}
                      </div>
                      <div className="flex items-center">
                        <Target className="h-3 w-3 mr-1 text-green-500" />
                        {rec.template.successRate}%
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {rec.template.timesUsed}x used
                      </div>
                    </div>

                    {rec.contextualNote && (
                      <div className="bg-green-50 border-l-4 border-green-400 p-2 rounded">
                        <p className="text-xs text-green-700 font-medium">
                          💡 {rec.contextualNote}
                        </p>
                      </div>
                    )}

                    <Button 
                      size="sm" 
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                    >
                      Load Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowRecommendations(false)}
                className="w-full"
              >
                Continue Without Template
              </Button>
            </CardContent>
          </Card>
        )}

        <div ref={messagesEndRef} />
      </div>

      <Separator />

      {/* Input Area */}
      <div className="p-4 bg-white">
        <div className="flex space-x-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Tell me about your trip requirements..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !currentMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Try: "7-day Phuket trip for 4 people, luxury budget" or "Family-friendly Singapore adventure"
        </p>
      </div>
    </div>
  );
};

export default EnhancedChatInterface;
