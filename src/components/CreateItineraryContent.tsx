import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, MapPin, MessageSquare, Sparkles, User } from "lucide-react";
import AIAssistant from "@/components/AIAssistant";
import ItineraryPreview from "@/components/ItineraryPreview";
import ItineraryMap from "@/components/ItineraryMap";

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
  onMessageSend: (message: string) => Promise<string>;
  isLoading: boolean;
}

const CreateItineraryContent: React.FC<CreateItineraryContentProps> = ({
  formData,
  onFormChange,
  sampleItinerary,
  onMessageSend,
  isLoading
}) => {
  // Demo users for PoC
  const demoTravelers = [
    { email: 'traveler@demo.com', name: 'Demo Traveler' },
    { email: 'agent@demo.com', name: 'Demo Agent' },
    { email: 'vendor@demo.com', name: 'Demo Vendor' }
  ];

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Trip Details Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="itineraryName" className="text-sm font-medium text-gray-700">
                  Itinerary Name
                </Label>
                <Input
                  id="itineraryName"
                  value={formData.itineraryName}
                  onChange={(e) => onFormChange('itineraryName', e.target.value)}
                  placeholder="e.g., Romantic Paris Getaway"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
                  Destination
                </Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => onFormChange('destination', e.target.value)}
                    placeholder="e.g., Paris, France"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => onFormChange('startDate', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => onFormChange('endDate', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="numberOfTravelers" className="text-sm font-medium text-gray-700">
                  Number of Travelers
                </Label>
                <div className="relative mt-1">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="numberOfTravelers"
                    value={formData.numberOfTravelers}
                    onChange={(e) => onFormChange('numberOfTravelers', e.target.value)}
                    placeholder="e.g., 2 adults"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="assignedTraveler" className="text-sm font-medium text-gray-700">
                  Assign to Client
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Select 
                    value={formData.assignedTravelerEmail} 
                    onValueChange={(value) => onFormChange('assignedTravelerEmail', value)}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select a client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {demoTravelers.map((traveler) => (
                        <SelectItem key={traveler.email} value={traveler.email}>
                          {traveler.name} ({traveler.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="clientPreferences" className="text-sm font-medium text-gray-700">
                  Client Preferences & Special Requests
                </Label>
                <Textarea
                  id="clientPreferences"
                  value={formData.clientPreferences}
                  onChange={(e) => onFormChange('clientPreferences', e.target.value)}
                  placeholder="e.g., vegetarian meals, accessibility needs, budget constraints, interests..."
                  rows={4}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant Card */}
          <Card className="shadow-lg border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-lg">
                <Sparkles className="h-5 w-5 mr-2" />
                AI Travel Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <AIAssistant
                onMessageSend={onMessageSend}
                userRole="agent"
                isLoading={isLoading}
                autoAppendAIResponse
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Itinerary Preview and Map */}
        <div className="lg:col-span-2 space-y-6">
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
