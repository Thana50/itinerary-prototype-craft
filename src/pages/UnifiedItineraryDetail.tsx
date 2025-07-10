
import React, { useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share, Download, Phone } from "lucide-react";
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
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4 hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/0eec4e7f-1447-475b-928f-96fbc0eca6e8.png" 
                alt="Travia Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{mockItinerary.title}</h1>
                <p className="text-sm text-gray-600">{mockItinerary.destination} • {mockItinerary.dates}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {userRole === 'traveler' && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleShareItinerary}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrintItinerary}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={handleRequestCall}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Agent
                </Button>
              </div>
            )}
            <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-green-100 rounded-full">
              <span className="text-sm font-medium text-gray-700">
                {userRole === 'agent' ? 'Agent View' : 'Traveler View'}
              </span>
            </div>
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
              <>
                <PricingUpdates totalPrice={totalPrice} modifications={modifications} />
                
                {/* Trip Summary Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Travelers</p>
                      <p className="font-medium text-gray-900">{mockItinerary.travelers} people</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium text-gray-900">15 days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Under Review
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Price</p>
                      <p className="font-semibold text-green-600 text-lg">${mockItinerary.totalPrice?.toLocaleString()}</p>
                    </div>
                  </div>
                  {mockItinerary.preferences && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Special Preferences</p>
                      <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">{mockItinerary.preferences}</p>
                    </div>
                  )}
                </div>
              </>
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
                
                {/* Quick Actions Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => aiAssistantRef.current?.focusInput("I'd like to add more cultural activities")}
                    >
                      Add cultural experiences
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => aiAssistantRef.current?.focusInput("Can we include more local food experiences?")}
                    >
                      More local dining
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => aiAssistantRef.current?.focusInput("I need family-friendly activities for kids")}
                    >
                      Family-friendly options
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedItineraryDetail;
