
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { parseTripDetails, generateSampleItinerary } from "@/utils/tripUtils";
import { aiService } from "@/services/aiService";
import { itineraryService } from "@/services/itineraryService";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useCreateItinerary = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    itineraryName: "",
    destination: "",
    startDate: "",
    endDate: "",
    numberOfTravelers: "",
    clientPreferences: "",
    assignedTravelerEmail: "traveler@demo.com" // Default to demo traveler
  });

  const [sampleItinerary, setSampleItinerary] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'agent')) {
      navigate("/");
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateFormWithTripDetails = (details: any) => {
    setFormData(prev => ({
      ...prev,
      ...(details.itineraryName && { itineraryName: details.itineraryName }),
      ...(details.destination && { destination: details.destination }),
      ...(details.numberOfTravelers && { numberOfTravelers: details.numberOfTravelers }),
      ...(details.duration && { clientPreferences: prev.clientPreferences + (prev.clientPreferences ? ", " : "") + `Duration: ${details.duration}` })
    }));

    // Don't auto-generate itinerary here - let template selection happen first
    // The template integration will handle itinerary generation
  };

  const generateItineraryWithoutTemplate = (destination: string, duration: string = "7 days") => {
    console.log('🟡 [useCreateItinerary] generateItineraryWithoutTemplate called with:', { destination, duration });
    const itinerary = generateSampleItinerary(destination, duration);
    console.log('🟡 [useCreateItinerary] Generated itinerary:', itinerary);
    setSampleItinerary(itinerary);
    console.log('🟡 [useCreateItinerary] Sample itinerary state updated');
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

  const getTravelerIdByEmail = async (email: string) => {
    try {
      console.log('Looking up traveler by email:', email);
      
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, name')
        .eq('email', email)
        .single();
      
      console.log('Traveler lookup result:', { data, error });
      
      if (error) {
        console.error('Error finding traveler by email:', error);
        return null;
      }
      
      if (!data) {
        console.error('No traveler found with email:', email);
        return null;
      }
      
      console.log('Found traveler:', data);
      return data.id;
    } catch (error) {
      console.error('Error in getTravelerIdByEmail:', error);
      return null;
    }
  };

  const handleSaveItinerary = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save an itinerary.",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!formData.destination) {
      toast({
        title: "Error",
        description: "Please enter a destination.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Error", 
        description: "Please select start and end dates.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.assignedTravelerEmail) {
      toast({
        title: "Error",
        description: "Please assign this itinerary to a client.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Attempting to save itinerary with traveler email:', formData.assignedTravelerEmail);
      
      // Get traveler ID by email
      const travelerId = await getTravelerIdByEmail(formData.assignedTravelerEmail);
      
      if (!travelerId) {
        console.error('Could not find traveler ID for email:', formData.assignedTravelerEmail);
        toast({
          title: "Error",
          description: `Client with email ${formData.assignedTravelerEmail} not found. Please check if the client account exists.`,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Successfully found traveler ID:', travelerId);
      
      const itineraryData = {
        agent_id: user.id,
        traveler_id: travelerId, // Assign the traveler
        name: formData.itineraryName || "Untitled Itinerary",
        destination: formData.destination,
        start_date: formData.startDate,
        end_date: formData.endDate,
        number_of_travelers: parseInt(formData.numberOfTravelers) || 1,
        preferences: formData.clientPreferences,
        status: 'draft' as const,
        days: sampleItinerary
      };

      console.log('Creating itinerary with data:', itineraryData);
      const savedItinerary = await itineraryService.createItinerary(itineraryData);
      console.log('Successfully created itinerary:', savedItinerary);
      
      toast({
        title: "Success",
        description: `Itinerary saved and assigned to ${formData.assignedTravelerEmail}!`,
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
      await logout();
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/agent-dashboard");
  };

  const updateSampleItinerary = (newItinerary: any[]) => {
    setSampleItinerary(newItinerary);
  };

  return {
    currentUser: user,
    formData,
    sampleItinerary,
    isLoading,
    handleChange,
    handleFormChange,
    handleMessageSend,
    handleSaveItinerary,
    handleLogout,
    handleBackToDashboard,
    updateSampleItinerary,
    generateItineraryWithoutTemplate
  };
};
