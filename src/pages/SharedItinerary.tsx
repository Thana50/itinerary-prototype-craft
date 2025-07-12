
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Check, Edit, MessageSquare } from "lucide-react";
import ItineraryPreview from "@/components/ItineraryPreview";
import AIAssistant, { AIAssistantRef } from "@/components/AIAssistant";
import { WorkflowProgressTracker } from "@/components/WorkflowProgressTracker";
import { useClientPortalActions } from "@/hooks/useClientPortalActions";
import { itineraryService } from "@/services/itineraryService";
import { aiService } from "@/services/aiService";
import type { Itinerary } from "@/lib/supabase";

const SharedItinerary = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const aiAssistantRef = useRef<AIAssistantRef>(null);
  const { handleApproveItinerary } = useClientPortalActions();
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modifications, setModifications] = useState<string>("");

  useEffect(() => {
    if (token) {
      loadItinerary();
    }
  }, [token]);

  const loadItinerary = async () => {
    try {
      setIsLoading(true);
      const data = await itineraryService.getItineraryByToken(token!);
      setItinerary(data);
    } catch (error) {
      console.error('Failed to load itinerary:', error);
      toast({
        title: "Error",
        description: "Invalid or expired itinerary link.",
        variant: "destructive"
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageSend = async (message: string) => {
    try {
      const aiResponse = await aiService.generateItineraryResponse(message, 'traveler');
      if (aiAssistantRef.current?.addAIMessage) {
        aiAssistantRef.current.addAIMessage(aiResponse);
      }
      
      // Store modification request
      setModifications(prev => prev + (prev ? "\n" : "") + `- ${message}`);
    } catch (error) {
      console.error('AI response error:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleConfirmItinerary = async () => {
    if (!itinerary) return;
    
    try {
      // Update with modifications first
      if (modifications) {
        await itineraryService.updateItinerary(itinerary.id, {
          preferences: itinerary.preferences + `\n\nTraveler Modifications:\n${modifications}`
        });
      }
      
      // Trigger the approval workflow
      await handleApproveItinerary(itinerary.id);
      
    } catch (error) {
      console.error('Confirm error:', error);
      toast({
        title: "Error",
        description: "Failed to confirm itinerary. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Itinerary Not Found</h1>
          <p className="text-gray-600">The itinerary link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0eec4e7f-1447-475b-928f-96fbc0eca6e8.png" 
              alt="Travia Logo" 
              className="h-14 w-auto mr-4"
            />
            <div>
              <h1 className="text-xl font-semibold">{itinerary.name}</h1>
              <p className="text-sm text-gray-600">{itinerary.destination}</p>
            </div>
          </div>
          <Button onClick={handleConfirmItinerary} className="bg-green-600 hover:bg-green-700">
            <Check className="mr-2 h-4 w-4" />
            Approve Itinerary
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Workflow Progress Tracker */}
        <WorkflowProgressTracker itineraryId={itinerary.id} className="mb-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Itinerary Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Destination</label>
                    <p className="text-gray-900">{itinerary.destination}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Travelers</label>
                    <p className="text-gray-900">{itinerary.number_of_travelers} people</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <p className="text-gray-900">{new Date(itinerary.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <p className="text-gray-900">{new Date(itinerary.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
                {itinerary.preferences && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Special Preferences</label>
                    <p className="text-gray-900 whitespace-pre-line">{itinerary.preferences}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <ItineraryPreview sampleItinerary={itinerary.days || []} />
          </div>

          {/* Right Column - AI Chat Interface */}
          <div className="lg:col-span-1">
            <AIAssistant 
              ref={aiAssistantRef} 
              onMessageSend={handleMessageSend}
              userRole="traveler"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedItinerary;
