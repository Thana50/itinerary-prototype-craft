
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { parseTripDetails, generateSampleItinerary } from "@/utils/tripUtils";
import { aiService } from "@/services/aiService";
import { itineraryService } from "@/services/itineraryService";
import { mockAuthService } from "@/services/mockAuthService";

export const useCreateItinerary = () => {
  const navigate = useNavigate();
  
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
      const userData = await mockAuthService.getCurrentUser();
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
      return aiResponse;
    } catch (error) {
      console.error('AI response error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
      throw error;
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
      await mockAuthService.signOut();
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/agent-dashboard");
  };

  return {
    currentUser,
    formData,
    sampleItinerary,
    isLoading,
    handleChange,
    handleMessageSend,
    handleSaveItinerary,
    handleLogout,
    handleBackToDashboard
  };
};
