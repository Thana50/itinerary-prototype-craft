import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import EnhancedChatInterface from "@/components/EnhancedChatInterface";
import ItineraryPreview from "@/components/ItineraryPreview";
import ItineraryMap from "@/components/ItineraryMap";
import CollapsibleTripContext from "@/components/CollapsibleTripContext";
import type { ItineraryTemplate } from "@/types/templates";
interface CreateItineraryContentProps {
  formData: {
    itineraryName: string;
    destination: string;
    startDate: string;
    endDate: string;
    numberOfTravelers: string;
    clientPreferences: string;
    assignedTravelerEmail: string;
  };
  onFormChange: (field: string, value: string) => void;
  sampleItinerary: any[];
  onMessageSend: (message: string) => Promise<string | void>;
  onChatTemplateSelect: (template: ItineraryTemplate) => void;
  onContinueWithoutTemplate: () => void;
  isLoading: boolean;
}

const CreateItineraryContent: React.FC<CreateItineraryContentProps> = ({
  formData,
  onFormChange,
  sampleItinerary,
  onMessageSend,
  onChatTemplateSelect,
  onContinueWithoutTemplate,
  isLoading
}) => {
  // Convert sample itinerary to map activities format
  const getMapActivities = () => {
    const activities: any[] = [];
    
    sampleItinerary.forEach(day => {
      day.activities?.forEach((activity: string, index: number) => {
        // Extract activity name (simplified - in real app you'd have coordinates stored)
        const activityName = activity.split(':')[1]?.split('-')[0]?.trim() || activity;
        
        // Sample coordinates for demonstration (in real app, these would come from a geocoding service)
        const sampleCoordinates = getSampleCoordinates(formData.destination, day.day, index);
        
        if (sampleCoordinates) {
          activities.push({
            name: activityName,
            coordinates: sampleCoordinates,
            day: day.day,
            type: getActivityType(activity)
          });
        }
      });
    });
    
    return activities;
  };

  // Helper function to get sample coordinates based on destination
  const getSampleCoordinates = (destination: string, day: number, activityIndex: number): [number, number] | null => {
    // This is a simplified implementation - in a real app, you'd use a geocoding service
    const destinationCoords: { [key: string]: [number, number] } = {
      'phuket': [98.3875, 7.8804],
      'bali': [115.0920, -8.4095],
      'paris': [2.3522, 48.8566],
      'tokyo': [139.6503, 35.6762],
      'new york': [-74.0060, 40.7128],
      'london': [-0.1276, 51.5074]
    };

    const baseCoords = destinationCoords[destination.toLowerCase()];
    if (!baseCoords) return null;

    // Add small random offset for different activities
    const offset = (day * 0.01) + (activityIndex * 0.005);
    return [
      baseCoords[0] + (Math.random() - 0.5) * offset,
      baseCoords[1] + (Math.random() - 0.5) * offset
    ];
  };

  const getActivityType = (activity: string): string => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes('restaurant') || activityLower.includes('dining') || activityLower.includes('food')) return 'dining';
    if (activityLower.includes('museum') || activityLower.includes('temple') || activityLower.includes('cultural')) return 'sightseeing';
    if (activityLower.includes('beach') || activityLower.includes('outdoor') || activityLower.includes('hiking')) return 'outdoor';
    if (activityLower.includes('shopping') || activityLower.includes('market')) return 'shopping';
    return 'sightseeing';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Chat (60% width) */}
        <div className="lg:w-[60%] space-y-6">
          {/* Collapsible Trip Context */}
          <CollapsibleTripContext
            formData={formData}
            onFormChange={onFormChange}
          />

          {/* AI Assistant Card */}
          <Card className="shadow-lg border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-lg">
                <Sparkles className="h-5 w-5 mr-2" />
                AI Travel Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <EnhancedChatInterface
                onTemplateSelect={onChatTemplateSelect}
                onMessageSend={(m) => { void onMessageSend(m); }}
                onContinueWithoutTemplate={onContinueWithoutTemplate}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview and Map (40% width) */}
        <div className="lg:w-[40%] space-y-6">
          {formData.destination && sampleItinerary.length > 0 && (
            <ItineraryMap
              activities={getMapActivities()}
              destination={formData.destination}
              className="shadow-lg"
            />
          )}
          
          <ItineraryPreview sampleItinerary={sampleItinerary} />
        </div>
      </div>
    </div>
  );
};

export default CreateItineraryContent;
