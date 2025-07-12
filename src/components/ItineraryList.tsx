
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, User, DollarSign, Share, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { itineraryService } from "@/services/itineraryService";
import type { Itinerary } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ItineraryListProps {
  role: "agent" | "traveler" | "vendor";
}

const ItineraryList: React.FC<ItineraryListProps> = ({ role }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadItineraries();
    }
  }, [user, role]);

  const loadItineraries = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      let data: Itinerary[] = [];
      
      if (role === "agent") {
        data = await itineraryService.getAgentItineraries(user.id);
      } else if (role === "traveler") {
        // For travelers, we'd need a different service method to get shared itineraries
        // For now, using agent itineraries as placeholder
        data = await itineraryService.getAgentItineraries(user.id);
        // Filter only shared itineraries for travelers
        data = data.filter(itinerary => itinerary.status === 'shared' || itinerary.traveler_id === user.id);
      }
      
      setItineraries(data);
    } catch (error) {
      console.error('Error loading itineraries:', error);
      toast({
        title: "Error",
        description: "Failed to load itineraries. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "shared":
        return <Badge variant="secondary">Shared</Badge>;
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "modified":
        return <Badge variant="outline">Modified</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewItinerary = (id: string) => {
    navigate(`/itinerary/${id}?role=${role}`);
  };

  const handleShareItinerary = async (itinerary: Itinerary) => {
    if (!user || role !== "agent") return;
    
    try {
      const travelerEmail = prompt("Enter traveler's email address:");
      if (!travelerEmail) return;
      
      await itineraryService.shareItinerary(itinerary.id, travelerEmail);
      toast({
        title: "Success",
        description: "Itinerary shared successfully!",
        variant: "default"
      });
      
      // Reload itineraries to show updated status
      loadItineraries();
    } catch (error) {
      console.error('Error sharing itinerary:', error);
      toast({
        title: "Error",
        description: "Failed to share itinerary. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading itineraries...</span>
        </div>
      </div>
    );
  }

  if (itineraries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          {role === "agent" 
            ? "No itineraries created yet." 
            : "No shared itineraries available."}
        </p>
        {role === "agent" && (
          <Button onClick={() => navigate("/create-itinerary")}>
            Create Your First Itinerary
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {itineraries.map((itinerary) => (
        <div key={itinerary.id} className="border rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-lg">{itinerary.name}</h3>
              <p className="text-sm text-muted-foreground">{itinerary.destination}</p>
            </div>
            {getStatusBadge(itinerary.status)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              {formatDateRange(itinerary.start_date, itinerary.end_date)}
            </div>
            
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              {itinerary.number_of_travelers} traveler{itinerary.number_of_travelers !== 1 ? 's' : ''}
            </div>

            <div className="flex items-center text-sm">
              <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
              {itinerary.days.length} days planned
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewItinerary(itinerary.id)}
            >
              {role === "traveler" ? "Review & Modify" : "View"} Itinerary
            </Button>
            
            {role === "agent" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleShareItinerary(itinerary)}
                disabled={itinerary.status === 'shared'}
              >
                <Share className="h-3.5 w-3.5 mr-1" />
                {itinerary.status === 'shared' ? 'Shared' : 'Share'}
              </Button>
            )}
            
            {role === "traveler" && itinerary.status === "shared" && (
              <Button size="sm">
                <Edit className="h-3.5 w-3.5 mr-1" />
                Suggest Changes
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItineraryList;
