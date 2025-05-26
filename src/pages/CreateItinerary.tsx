
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import TripOverviewForm from "@/components/TripOverviewForm";
import AIAssistant, { AIAssistantRef } from "@/components/AIAssistant";
import { parseTripDetails, getAIResponse, TripDetails } from "@/utils/tripUtils";

const CreateItinerary = () => {
  const navigate = useNavigate();
  const aiAssistantRef = useRef<AIAssistantRef>(null);
  
  const [formData, setFormData] = useState({
    itineraryName: "",
    destination: "",
    startDate: "",
    endDate: "",
    numberOfTravelers: "",
    clientPreferences: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateFormWithTripDetails = (details: TripDetails) => {
    setFormData(prev => ({
      ...prev,
      ...(details.itineraryName && { itineraryName: details.itineraryName }),
      ...(details.destination && { destination: details.destination }),
      ...(details.numberOfTravelers && { numberOfTravelers: details.numberOfTravelers }),
      ...(details.duration && { clientPreferences: prev.clientPreferences + (prev.clientPreferences ? ", " : "") + `Duration: ${details.duration}` })
    }));
  };

  const handleMessageSend = (message: string) => {
    // Parse trip details and update form
    const tripDetails = parseTripDetails(message);
    if (Object.keys(tripDetails).length > 0) {
      updateFormWithTripDetails(tripDetails);
    }

    // Generate AI response
    setTimeout(() => {
      const aiResponse = getAIResponse(message, tripDetails);
      if (aiAssistantRef.current?.addAIMessage) {
        aiAssistantRef.current.addAIMessage(aiResponse);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/ef555a68-c6d2-42b5-a2c1-a1469ea4d143.png" 
              alt="Travia Logo" 
              className="h-12 w-auto mr-4"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, Agent!</span>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Itinerary Builder</h1>
          <Button variant="ghost" onClick={() => navigate("/agent-dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trip Overview Form */}
          <div className="lg:col-span-2">
            <TripOverviewForm formData={formData} onFormChange={handleChange} />
          </div>

          {/* Right Column - AI Chat Interface */}
          <div className="lg:col-span-1">
            <AIAssistant ref={aiAssistantRef} onMessageSend={handleMessageSend} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          © 2025 Travia. Where Custom Trips Click.
        </footer>
      </div>
    </div>
  );
};

export default CreateItinerary;
