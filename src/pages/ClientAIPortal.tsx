
import React, { useState, useRef } from "react";
import { aiService } from "@/services/aiService";
import AIAssistant, { AIAssistantRef } from "@/components/AIAssistant";
import ClientItineraryDisplay from "@/components/ClientItineraryDisplay";
import PricingUpdates from "@/components/PricingUpdates";
import ModificationTracking from "@/components/ModificationTracking";
import WeatherForecast from "@/components/WeatherForecast";
import PhuketMap from "@/components/PhuketMap";
import ClientPortalHeader from "@/components/ClientPortalHeader";
import ApprovalWorkflow from "@/components/ApprovalWorkflow";
import { useSearchParams } from "react-router-dom";
import { useItineraryState } from "@/hooks/useItineraryState";
import { useClientPortalActions } from "@/hooks/useClientPortalActions";
import { detectModification } from "@/utils/modificationDetector";

const ClientAIPortal = () => {
  const [searchParams] = useSearchParams();
  const isAgentView = searchParams.get('agent') === 'true';
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

  const tripDetails = {
    destination: "Phuket, Thailand",
    duration: "7 days",
    travelers: "4 people",
    startDate: "March 15, 2024",
    endDate: "March 22, 2024"
  };

  const handleMessageSend = async (message: string) => {
    setIsLoading(true);
    
    try {
      // Get AI response
      const aiResponse = await aiService.generateItineraryResponse(message, 'traveler');
      
      // Check for modifications and update itinerary
      const modification = detectModification(message);
      if (modification) {
        updateItinerary(modification);
        addModification(modification);
      }

      // Add AI response to chat
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
      <ClientPortalHeader 
        tripDetails={tripDetails} 
        customizationProgress={customizationProgress}
        showBackButton={isAgentView}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Itinerary Display (60% / 3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            <ClientItineraryDisplay itinerary={itinerary} />
            <PhuketMap />
            <WeatherForecast />
            <PricingUpdates totalPrice={totalPrice} modifications={modifications} />
          </div>

          {/* Right Side - AI Chat Interface (40% / 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <AIAssistant 
              ref={aiAssistantRef}
              onMessageSend={handleMessageSend}
              userRole="traveler"
              isLoading={isLoading}
            />
            
            <ModificationTracking modifications={modifications} />
            
            <ApprovalWorkflow 
              onApproveItinerary={handleApproveItinerary}
              onRequestCall={handleRequestCall}
              onSaveChanges={handleSaveChanges}
              onShareItinerary={handleShareItinerary}
              onPrintItinerary={handlePrintItinerary}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAIPortal;
