
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Clock } from "lucide-react";
import AIAssistant from "@/components/AIAssistant";
import ClientItineraryDisplay from "@/components/ClientItineraryDisplay";

const ClientAIPortal = () => {
  const handleMessageSend = async (message: string) => {
    // Simulate AI response for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "Thank you for your message! I'd be happy to help you customize your Phuket adventure. What specific changes would you like to make to your itinerary?";
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
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              Client Portal
            </Badge>
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
          <div className="lg:col-span-3">
            <ClientItineraryDisplay />
          </div>

          {/* Right Side - AI Chat Interface (40% / 2 columns) */}
          <div className="lg:col-span-2">
            <AIAssistant 
              onMessageSend={handleMessageSend}
              userRole="traveler"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAIPortal;
