
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Share } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import TripOverviewForm from "@/components/TripOverviewForm";
import AIAssistant, { AIAssistantRef } from "@/components/AIAssistant";
import { parseTripDetails, generateSampleItinerary } from "@/utils/tripUtils";
import { aiService } from "@/services/aiService";
import { itineraryService } from "@/services/itineraryService";
import { authService } from "@/services/authService";

const CreateItinerary = () => {
  const navigate = useNavigate();
  const aiAssistantRef = useRef<AIAssistantRef>(null);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    itineraryName: "",
    destination: "",
    startDate: "",
    endDate: "",
    numberOfTravelers: "",
    clientPreferences: ""
  });

  const [sampleItinerary, setSampleItinerary] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (!userData || userData.profile?.role !== 'agent') {
        navigate("/login");
        return;
      }
      setCurrentUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate("/login");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateFormWithTripDetails = (details: any) => {
    setFormData(prev => ({
      ...prev,
      ...(details.itineraryName && { itineraryName: details.itineraryName }),
      ...(details.destination && { destination: details.destination }),
      ...(details.numberOfTravelers && { numberOfTravelers: details.numberOfTravelers }),
      ...(details.duration && { clientPreferences: prev.clientPreferences + (prev.clientPreferences ? ", " : "") + `Duration: ${details.duration}` })
    }));

    if (details.destination) {
      const itinerary = generateSampleItinerary(details.destination, details.duration || "7 days");
      setSampleItinerary(itinerary);
    }
  };

  const handleMessageSend = async (message: string) => {
    setIsLoading(true);
    
    try {
      // Parse trip details and update form
      const tripDetails = parseTripDetails(message);
      if (Object.keys(tripDetails).length > 0) {
        updateFormWithTripDetails(tripDetails);
      }

      // Generate AI response
      const aiResponse = await aiService.generateItineraryResponse(message, 'agent');
      if (aiAssistantRef.current?.addAIMessage) {
        aiAssistantRef.current.addAIMessage(aiResponse);
      }
    } catch (error) {
      console.error('AI response error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      
      const itineraryData = {
        agent_id: currentUser.user.id,
        name: formData.itineraryName || "Untitled Itinerary",
        destination: formData.destination,
        start_date: formData.startDate,
        end_date: formData.endDate,
        number_of_travelers: parseInt(formData.numberOfTravelers) || 1,
        preferences: formData.clientPreferences,
        status: 'draft' as const,
        days: sampleItinerary
      };

      const savedItinerary = await itineraryService.createItinerary(itineraryData);
      
      toast({
        title: "Success",
        description: "Itinerary saved successfully!",
      });

      // Navigate to itinerary detail page
      navigate(`/itinerary/${savedItinerary.id}`);
      
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save itinerary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/agent-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0eec4e7f-1447-475b-928f-96fbc0eca6e8.png" 
              alt="Travia Logo" 
              className="h-14 w-auto mr-4"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {currentUser?.profile?.name || 'Agent'}!</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Itinerary Builder</h1>
          <div className="flex gap-2">
            <Button 
              onClick={handleSaveItinerary} 
              disabled={isLoading || !formData.destination}
              className="bg-green-600 hover:bg-green-700"
            >
              <Share className="mr-2 h-4 w-4" />
              Save & Share
            </Button>
            <Button variant="ghost" onClick={handleBackToDashboard}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trip Overview Form */}
          <div className="lg:col-span-2">
            <TripOverviewForm 
              formData={formData} 
              onFormChange={handleChange} 
              sampleItinerary={sampleItinerary}
            />
          </div>

          {/* Right Column - AI Chat Interface */}
          <div className="lg:col-span-1">
            <AIAssistant 
              ref={aiAssistantRef} 
              onMessageSend={handleMessageSend}
              isLoading={isLoading}
            />
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
