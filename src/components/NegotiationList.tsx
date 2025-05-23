
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NegotiationList: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data
  const negotiations = [
    {
      id: "n1",
      itineraryTitle: "European Adventure",
      agency: "Globetrotter Travel",
      service: "Private Villa Rental in Tuscany",
      dates: "June 18 - June 22, 2025",
      requestedPrice: 2800,
      status: "pending",
      daysToRespond: 2,
    },
    {
      id: "n2",
      itineraryTitle: "Asian Exploration",
      agency: "Wanderlust Adventures",
      service: "Traditional Ryokan Stay",
      dates: "September 7 - September 10, 2025",
      requestedPrice: 1200,
      status: "countered",
      daysToRespond: 1,
    },
    {
      id: "n3",
      itineraryTitle: "Caribbean Getaway",
      agency: "Paradise Travels",
      service: "Private Yacht Tour",
      dates: "July 12, 2025",
      requestedPrice: 950,
      status: "accepted",
      daysToRespond: 0,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Awaiting Response</Badge>;
      case "countered":
        return <Badge variant="outline">Counter Offer Made</Badge>;
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewNegotiation = (id: string) => {
    navigate(`/negotiation/${id}`);
  };

  return (
    <div className="space-y-4">
      {negotiations.map((negotiation) => (
        <div key={negotiation.id} className="border rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">{negotiation.service}</h3>
                {getStatusBadge(negotiation.status)}
              </div>
              <p className="text-sm text-muted-foreground">
                For: {negotiation.itineraryTitle} ({negotiation.agency})
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <div className="flex items-center text-lg font-semibold">
                <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" />
                {negotiation.requestedPrice}
              </div>
              {negotiation.status === "pending" && (
                <p className="text-xs text-muted-foreground text-right">
                  Respond in {negotiation.daysToRespond} day{negotiation.daysToRespond !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center text-sm mb-4">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            {negotiation.dates}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewNegotiation(negotiation.id)}
            >
              View Details
            </Button>
            
            {negotiation.status === "pending" && (
              <Button size="sm">
                Respond to Request
              </Button>
            )}
            
            {negotiation.status !== "pending" && (
              <Button variant="outline" size="sm">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Message
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NegotiationList;
