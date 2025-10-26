import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin, User, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import ItineraryPreview from "@/components/ItineraryPreview";
import ItineraryMap from "@/components/ItineraryMap";
import AIStatusIndicator from "./AIStatusIndicator";
import BusinessMetrics from "./BusinessMetrics";
import WizardProgress from "./WizardProgress";
import DemoModeToggle from "./DemoModeToggle";
import type { ItineraryTemplate } from "@/types/templates";

interface CreateItineraryWizardProps {
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

const CreateItineraryWizard: React.FC<CreateItineraryWizardProps> = ({
  formData,
  onFormChange,
  sampleItinerary,
  onContinueWithoutTemplate,
  isLoading
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [aiStatus, setAiStatus] = useState<'idle' | 'analyzing' | 'generating' | 'complete'>('idle');
  const [confidence, setConfidence] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [generationStartTime, setGenerationStartTime] = useState(0);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  const demoTravelers = [
    { email: 'traveler@demo.com', name: 'Demo Traveler' },
    { email: 'agent@demo.com', name: 'Demo Agent' },
    { email: 'vendor@demo.com', name: 'Demo Vendor' }
  ];

  const demoScenarios: { [key: string]: any } = {
    'luxury-bali': {
      itineraryName: 'Luxury Bali Experience',
      destination: 'Bali',
      startDate: '2025-03-15',
      endDate: '2025-03-22',
      numberOfTravelers: '4',
      clientPreferences: 'Luxury accommodation, private tours, fine dining, spa treatments, cultural experiences',
      assignedTravelerEmail: 'traveler@demo.com'
    },
    'paris-romance': {
      itineraryName: 'Romantic Paris Getaway',
      destination: 'Paris',
      startDate: '2025-04-10',
      endDate: '2025-04-17',
      numberOfTravelers: '2',
      clientPreferences: 'Romantic restaurants, wine tasting, art museums, Seine river cruise',
      assignedTravelerEmail: 'traveler@demo.com'
    },
    'tokyo-adventure': {
      itineraryName: 'Tokyo Tech & Culture',
      destination: 'Tokyo',
      startDate: '2025-05-01',
      endDate: '2025-05-08',
      numberOfTravelers: '3',
      clientPreferences: 'Technology districts, traditional temples, authentic ramen, anime culture',
      assignedTravelerEmail: 'traveler@demo.com'
    }
  };

  const handleQuickDemo = (scenario: string) => {
    const demoData = demoScenarios[scenario];
    if (demoData) {
      Object.keys(demoData).forEach(key => {
        onFormChange(key, demoData[key]);
      });
      setIsDemoMode(true);
      simulateAIGeneration();
    }
  };

  const simulateAIGeneration = async () => {
    setGenerationStartTime(Date.now());
    setCurrentStep(2);
    setAiStatus('analyzing');
    setShowTypingIndicator(true);
    
    // Simulate AI thinking time (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAiStatus('generating');
    setConfidence(0);
    
    // Gradually increase confidence
    const confidenceInterval = setInterval(() => {
      setConfidence(prev => {
        if (prev >= 94) {
          clearInterval(confidenceInterval);
          return 94;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowTypingIndicator(false);
    onContinueWithoutTemplate();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAiStatus('complete');
    setCurrentStep(3);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && formData.destination) {
      simulateAIGeneration();
    } else if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getMapActivities = () => {
    const activities: any[] = [];
    sampleItinerary.forEach(day => {
      day.activities?.forEach((activity: string, index: number) => {
        const activityName = activity.split(':')[1]?.split('-')[0]?.trim() || activity;
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

  const getSampleCoordinates = (destination: string, day: number, activityIndex: number): [number, number] | null => {
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
    const offset = (day * 0.01) + (activityIndex * 0.005);
    return [
      baseCoords[0] + (Math.random() - 0.5) * offset,
      baseCoords[1] + (Math.random() - 0.5) * offset
    ];
  };

  const getActivityType = (activity: string): string => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes('restaurant') || activityLower.includes('dining')) return 'dining';
    if (activityLower.includes('museum') || activityLower.includes('temple')) return 'sightseeing';
    if (activityLower.includes('beach') || activityLower.includes('outdoor')) return 'outdoor';
    return 'sightseeing';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Progress Bar */}
      <WizardProgress currentStep={currentStep} totalSteps={3} />

      {/* AI Status */}
      <AIStatusIndicator 
        status={aiStatus} 
        confidence={confidence}
        message={showTypingIndicator ? "AI is thinking..." : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-4">
          {currentStep === 1 && (
            <>
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Trip Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="itineraryName">Itinerary Name</Label>
                    <Input
                      id="itineraryName"
                      value={formData.itineraryName}
                      onChange={(e) => onFormChange('itineraryName', e.target.value)}
                      placeholder="e.g., Romantic Paris Getaway"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="destination">Destination</Label>
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
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => onFormChange('startDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
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
                    <Label htmlFor="numberOfTravelers">Number of Travelers</Label>
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
                    <Label htmlFor="assignedTraveler">Assign to Client</Label>
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
                              {traveler.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="clientPreferences">Client Preferences</Label>
                    <Textarea
                      id="clientPreferences"
                      value={formData.clientPreferences}
                      onChange={(e) => onFormChange('clientPreferences', e.target.value)}
                      placeholder="e.g., vegetarian meals, accessibility needs..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <DemoModeToggle
                isDemoMode={isDemoMode}
                onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
                onQuickDemo={handleQuickDemo}
              />
            </>
          )}

          {(currentStep === 2 || currentStep === 3) && (
            <BusinessMetrics 
              showTimer={currentStep === 2 || currentStep === 3}
              startTime={generationStartTime}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {currentStep === 2 && (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-pulse">
                    <Sparkles className="h-16 w-16 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">AI Processing Your Request</h3>
                  <p className="text-gray-600">
                    Our advanced AI is analyzing your preferences and generating a personalized itinerary...
                  </p>
                  {showTypingIndicator && (
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && sampleItinerary.length > 0 && (
            <>
              {formData.destination && (
                <ItineraryMap
                  activities={getMapActivities()}
                  destination={formData.destination}
                  className="shadow-lg animate-fade-in"
                />
              )}
              <ItineraryPreview sampleItinerary={sampleItinerary} />
            </>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNextStep}
          disabled={currentStep === 1 && !formData.destination}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          {currentStep === 3 ? 'Complete' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CreateItineraryWizard;
