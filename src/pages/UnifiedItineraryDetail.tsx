
import React, { useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ClientItineraryDisplay from "@/components/ClientItineraryDisplay";
import AIAssistant, { AIAssistantRef } from "@/components/AIAssistant";
import ApprovalWorkflow from "@/components/ApprovalWorkflow";
import ModificationTracking from "@/components/ModificationTracking";
import PricingUpdates from "@/components/PricingUpdates";
import { aiService } from "@/services/aiService";
import { useItineraryState } from "@/hooks/useItineraryState";
import { useClientPortalActions } from "@/hooks/useClientPortalActions";
import { detectModification } from "@/utils/modificationDetector";
import type { ItineraryData } from "@/types/itinerary";

const UnifiedItineraryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userRole = searchParams.get('role') as 'agent' | 'traveler' || 'traveler';
  const aiAssistantRef = useRef<AIAssistantRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    itinerary,
    totalPrice,
    modifications,
    customizationProgress,
    updateItinerary,
    addModification
  } = useItineraryState();

  const {
    handleApproveItinerary,
    handleRequestCall,
    handleSaveChanges,
    handleShareItinerary,
    handlePrintItinerary
  } = useClientPortalActions();

  // Mock data - in real app this would come from API based on ID
  const mockItinerary: ItineraryData = {
    id: id || '1',
    title: "European Adventure",
    destination: "France, Italy, Spain",
    dates: "June 15 - June 30, 2025",
    startDate: "June 15, 2025",
    endDate: "June 30, 2025",
    status: "review",
    client: "John & Sarah Smith",
    travelers: 2,
    totalPrice: 8900,
    days: [
      {
        day: 1,
        title: "Arrival in Paris",
        activities: [
          "🛬 Airport pickup and transfer to hotel",
          "🏨 Check-in at Grand Hotel Paris",
          "🍽️ Welcome dinner at Le Bistrot",
          "🌃 Evening stroll along the Seine"
        ],
        date: "June 15, 2025",
        location: "Paris, France",
        accommodation: "Grand Hotel Paris"
      },
      {
        day: 2,
        title: "Paris Exploration",
        activities: [
          "🗼 Visit Eiffel Tower with skip-the-line tickets",
          "☕ Coffee break at Café Madeleine",
          "🎨 Guided tour of Montmartre district",
          "🍷 Dinner and wine tasting in Le Marais"
        ],
        date: "June 16, 2025",
        location: "Paris, France",
        accommodation: "Grand Hotel Paris"
      },
      {
        day: 3,
        title: "Travel to Rome",
        activities: [
          "✈️ Morning flight to Rome",
          "🏨 Check-in at Roma Luxe Hotel",
          "🍝 Lunch at authentic Roman trattoria",
          "🏛️ Evening walk through Trastevere"
        ],
        date: "June 17, 2025",
        location: "Rome, Italy",
        accommodation: "Roma Luxe Hotel"
      }
    ],
    preferences: "Family-friendly activities, halal food options when possible",
    modificationRequests: 2,
    negotiations: 1
  };

  const handleMessageSend = async (message: string) => {
    setIsLoading(true);
    
    try {
      const aiResponse = await aiService.generateItineraryResponse(message, userRole);
      
      const modification = detectModification(message);
      if (modification) {
        updateItinerary(modification);
        addModification(modification);
      }

      if (aiAssistantRef.current) {
        aiAssistantRef.current.addAIMessage(aiResponse);
      }
      
      return aiResponse;
    } catch (error) {
      console.error('Error sending message:', error);
      return "I apologize, but I'm having trouble processing your request. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{mockItinerary.title}</h1>
              <p className="text-sm text-gray-600">{mockItinerary.destination}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {userRole === 'agent' ? 'Agent View' : 'Traveler View'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Itinerary Display */}
          <div className="lg:col-span-3 space-y-6">
            <ClientItineraryDisplay itinerary={mockItinerary.days} />
            {userRole === 'traveler' && (
              <PricingUpdates totalPrice={totalPrice} modifications={modifications} />
            )}
          </div>

          {/* Right Side - AI Chat and Actions */}
          <div className="lg:col-span-2 space-y-6">
            <AIAssistant 
              ref={aiAssistantRef}
              onMessageSend={handleMessageSend}
              userRole={userRole}
              isLoading={isLoading}
            />
            
            {userRole === 'traveler' && (
              <>
                <ModificationTracking modifications={modifications} />
                <ApprovalWorkflow 
                  onApproveItinerary={handleApproveItinerary}
                  onRequestCall={handleRequestCall}
                  onSaveChanges={handleSaveChanges}
                  onShareItinerary={handleShareItinerary}
                  onPrintItinerary={handlePrintItinerary}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedItineraryDetail;
