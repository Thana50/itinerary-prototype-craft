import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Users, Clock, Phone, Save, CheckCircle, Share2, Printer } from "lucide-react";
import { aiService } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";
import AIAssistant, { AIAssistantRef } from "@/components/AIAssistant";
import ClientItineraryDisplay from "@/components/ClientItineraryDisplay";
import PricingUpdates from "@/components/PricingUpdates";
import ModificationTracking from "@/components/ModificationTracking";
import WeatherForecast from "@/components/WeatherForecast";
import PhuketMap from "@/components/PhuketMap";

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

  const tripDetails = {
    destination: "Phuket, Thailand",
    duration: "7 days",
    travelers: "4 people",
    startDate: "March 15, 2024",
    endDate: "March 22, 2024"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">
                TRAVIA
                <span className="text-gray-600 text-sm ml-2 font-normal">
                  - Where Custom Trips Click.
                </span>
              </h1>
              <p className="text-lg text-gray-700 mt-1">
                Your Personalized Southeast Asian Adventure
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                Customization in Progress
              </Badge>
              <div className="text-right">
                <div className="text-sm text-gray-600">Progress</div>
                <Progress value={customizationProgress} className="w-24" />
              </div>
            </div>
          </div>
          
          {/* Trip Summary */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-blue-500" />
              {tripDetails.destination}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-green-500" />
              {tripDetails.duration}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-purple-500" />
              {tripDetails.travelers}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-orange-500" />
              {tripDetails.startDate} - {tripDetails.endDate}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Itinerary Display (60% / 3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            <ClientItineraryDisplay itinerary={itinerary} />
            
            {/* Phuket Activity Map */}
            <PhuketMap />
            
            {/* Weather Forecast */}
            <WeatherForecast />
            
            {/* Pricing Updates */}
            <PricingUpdates totalPrice={totalPrice} modifications={modifications} />
            
            {/* Share and Print Options */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleShareItinerary} className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share with Companion
                  </Button>
                  <Button variant="outline" onClick={handlePrintItinerary} className="flex-1">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Itinerary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - AI Chat Interface (40% / 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <AIAssistant 
              ref={aiAssistantRef}
              onMessageSend={handleMessageSend}
              userRole="traveler"
              isLoading={isLoading}
            />
            
            {/* Modification Tracking */}
            <ModificationTracking modifications={modifications} />
            
            {/* Approval Workflow */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button 
                  onClick={handleApproveItinerary} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve This Itinerary
                </Button>
                <Button 
                  onClick={handleRequestCall} 
                  variant="outline" 
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Request Agent Call
                </Button>
                <Button 
                  onClick={handleSaveChanges} 
                  variant="outline" 
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes & Continue Later
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAIPortal;
