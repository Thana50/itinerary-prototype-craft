import React, { useState, useRef } from "react";
import { aiService } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";
import AIAssistant, { AIAssistantRef } from "@/components/AIAssistant";
import ClientItineraryDisplay from "@/components/ClientItineraryDisplay";
import PricingUpdates from "@/components/PricingUpdates";
import ModificationTracking from "@/components/ModificationTracking";
import WeatherForecast from "@/components/WeatherForecast";
import PhuketMap from "@/components/PhuketMap";
import ClientPortalHeader from "@/components/ClientPortalHeader";
import ApprovalWorkflow from "@/components/ApprovalWorkflow";

interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

interface Modification {
  id: string;
  description: string;
  priceChange: number;
  timestamp: Date;
}

const ClientAIPortal = () => {
  const aiAssistantRef = useRef<AIAssistantRef>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(3100);
  const [modifications, setModifications] = useState<Modification[]>([]);
  const [customizationProgress, setCustomizationProgress] = useState(25);

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    {
      day: 1,
      title: "Arrival & Patong Beach",
      activities: [
        "🚌 Airport transfer to hotel",
        "🏨 Hotel check-in and welcome drink", 
        "🏖️ Patong Beach sunset walk",
        "🍽️ Halal dinner at local Thai restaurant"
      ]
    },
    {
      day: 2,
      title: "Phi Phi Islands Adventure",
      activities: [
        "🛥️ Island hopping boat tour",
        "🤿 Snorkeling at Maya Bay",
        "🍽️ Halal lunch on boat",
        "🌅 Return to hotel evening"
      ]
    },
    {
      day: 3,
      title: "Cultural Phuket Experience", 
      activities: [
        "🛕 Big Buddha Temple visit",
        "🏛️ Old Town Phuket walking tour",
        "💆 Traditional Thai massage",
        "🍜 Halal street food experience"
      ]
    },
    {
      day: 4,
      title: "Adventure & Nature",
      activities: [
        "🌿 Zip lining through jungle",
        "🏍️ ATV adventure tour", 
        "🐘 Elephant sanctuary visit",
        "🏊 Pool relaxation time"
      ]
    }
  ]);

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

  const detectModification = (message: string): Modification | null => {
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('cooking class') && lowercaseMessage.includes('day 3')) {
      return {
        id: Date.now().toString(),
        description: "Added Thai cooking class to Day 3",
        priceChange: 45,
        timestamp: new Date()
      };
    }
    
    if (lowercaseMessage.includes('more beach') || lowercaseMessage.includes('beach day')) {
      return {
        id: Date.now().toString(),
        description: "Extended beach activities",
        priceChange: 25,
        timestamp: new Date()
      };
    }
    
    if (lowercaseMessage.includes('spa') || lowercaseMessage.includes('massage')) {
      return {
        id: Date.now().toString(),
        description: "Added luxury spa treatment",
        priceChange: 80,
        timestamp: new Date()
      };
    }
    
    return null;
  };

  const updateItinerary = (modification: Modification) => {
    if (modification.description.includes('cooking class')) {
      setItinerary(prev => prev.map(day => 
        day.day === 3 
          ? {
              ...day,
              title: "Cultural & Culinary Experience",
              activities: [...day.activities, "👨‍🍳 Thai cooking class (evening)"]
            }
          : day
      ));
      setCustomizationProgress(prev => Math.min(prev + 15, 100));
    }
    
    if (modification.description.includes('beach')) {
      setItinerary(prev => [...prev, {
        day: 5,
        title: "Extended Beach Paradise",
        activities: [
          "🏖️ Full day at Kata Beach",
          "🏄‍♂️ Water sports activities",
          "🍹 Beachside lunch",
          "🌅 Sunset photography session"
        ]
      }]);
      setCustomizationProgress(prev => Math.min(prev + 20, 100));
    }
  };

  const addModification = (modification: Modification) => {
    setModifications(prev => [modification, ...prev]);
    setTotalPrice(prev => prev + (modification.priceChange * 4)); // 4 people
  };

  const handleApproveItinerary = () => {
    toast({
      title: "Itinerary Approved!",
      description: "Your customized trip has been sent to your travel agent for final booking.",
    });
  };

  const handleRequestCall = () => {
    toast({
      title: "Call Requested",
      description: "Your travel agent will contact you within 2 hours to discuss your itinerary.",
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your modifications have been saved. You can continue customizing anytime.",
    });
  };

  const handleShareItinerary = () => {
    navigator.clipboard.writeText("https://travia.app/shared/phuket-abc123");
    toast({
      title: "Link Copied!",
      description: "Share this view-only link with your travel companions.",
    });
  };

  const handlePrintItinerary = () => {
    window.print();
    toast({
      title: "Print Ready",
      description: "Your itinerary is ready to print.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <ClientPortalHeader 
        tripDetails={tripDetails} 
        customizationProgress={customizationProgress}
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
