
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, User, DollarSign, Share } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ItineraryData } from "@/types/itinerary";

interface ItineraryListProps {
  role: "agent" | "traveler" | "vendor";
}

const ItineraryList: React.FC<ItineraryListProps> = ({ role }) => {
  const navigate = useNavigate();
  
  // Mock data using unified type
  const itineraries: ItineraryData[] = [
    {
      id: "it1",
      title: "European Adventure",
      destination: "France, Italy, Spain",  
      dates: "June 15 - June 30, 2025",
      status: "review",
      client: "John & Sarah Smith",
      travelers: 2,
      totalPrice: 8900,
      modificationRequests: 2,
      negotiations: 3,
      days: []
    },
    {
      id: "it2", 
      title: "Asian Exploration",
      destination: "Japan, Thailand, Vietnam",
      dates: "September 5 - September 20, 2025",
      status: "approved",
      client: "Michael Johnson",
      travelers: 1,
      totalPrice: 6500,
      modificationRequests: 0,
      negotiations: 1,
      days: []
    },
    {
      id: "it3",
      title: "Caribbean Getaway", 
      destination: "Jamaica, Bahamas",
      dates: "July 10 - July 17, 2025",
      status: "draft",
      client: "Emily & David Wilson",
      travelers: 2,
      totalPrice: 4200,
      modificationRequests: 0,
      negotiations: 0,
      days: []
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "review":
        return <Badge variant="secondary">Under Review</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewItinerary = (id: string) => {
    navigate(`/itinerary/${id}?role=${role}`);
  };

  return (
    <div className="space-y-4">
      {itineraries.map((itinerary) => (
        <div key={itinerary.id} className="border rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-lg">{itinerary.title}</h3>
              <p className="text-sm text-muted-foreground">{itinerary.destination}</p>
            </div>
            {getStatusBadge(itinerary.status)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              {itinerary.dates}
            </div>
            
            {role === "agent" && itinerary.client && (
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                {itinerary.client}
              </div>
            )}
            
            {(itinerary.modificationRequests || 0) > 0 && (
              <div className="flex items-center text-sm">
                <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                {itinerary.modificationRequests} modifications
              </div>
            )}
            
            {role === "agent" && (itinerary.negotiations || 0) > 0 && (
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                {itinerary.negotiations} price negotiations
              </div>
            )}
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
              <Button variant="outline" size="sm">
                <Share className="h-3.5 w-3.5 mr-1" />
                Share
              </Button>
            )}
            
            {role === "traveler" && itinerary.status === "review" && (
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
