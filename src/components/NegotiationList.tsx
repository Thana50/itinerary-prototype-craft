
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MessageSquare, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { negotiationService } from "@/services/negotiationService";
import type { Negotiation } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const NegotiationList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNegotiations();
    }
  }, [user]);

  const loadNegotiations = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      let data: Negotiation[] = [];
      
      if (user.role === "agent") {
        data = await negotiationService.getAgentNegotiations(user.id);
      } else if (user.role === "vendor") {
        data = await negotiationService.getVendorNegotiations(user.id);
      }
      
      setNegotiations(data);
    } catch (error) {
      console.error('Error loading negotiations:', error);
      toast({
        title: "Error",
        description: "Failed to load negotiations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Awaiting Response</Badge>;
      case "negotiating":
        return <Badge variant="outline">In Progress</Badge>;
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewNegotiation = (id: string) => {
    navigate(`/negotiation-room/${id}`);
  };

  const getLatestPriceOffer = (negotiation: Negotiation): number | null => {
    if (!negotiation.messages || negotiation.messages.length === 0) return null;
    
    // Find the most recent message with a price offer
    for (let i = negotiation.messages.length - 1; i >= 0; i--) {
      const message = negotiation.messages[i];
      if (message.price_offer) {
        return message.price_offer;
      }
    }
    return null;
  };

  const getDaysToRespond = (negotiation: Negotiation): number => {
    const updatedAt = new Date(negotiation.updated_at);
    const now = new Date();
    const diffTime = now.getTime() - updatedAt.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - diffDays); // Assuming 7 days to respond
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading negotiations...</span>
        </div>
      </div>
    );
  }

  if (negotiations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No negotiations found.</p>
        {user?.role === "agent" && (
          <Button onClick={() => navigate("/rate-negotiation")}>
            Start New Negotiation
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {negotiations.map((negotiation) => {
        const latestPrice = getLatestPriceOffer(negotiation);
        const daysToRespond = getDaysToRespond(negotiation);
        
        return (
          <div key={negotiation.id} className="border rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-lg">{negotiation.service_type}</h3>
                  {getStatusBadge(negotiation.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {negotiation.description}
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                {latestPrice && (
                  <div className="flex items-center text-lg font-semibold">
                    <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" />
                    {latestPrice.toLocaleString()}
                  </div>
                )}
                {negotiation.status === "pending" && daysToRespond > 0 && (
                  <p className="text-xs text-muted-foreground text-right">
                    Respond in {daysToRespond} day{daysToRespond !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center text-sm mb-4">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              Created: {new Date(negotiation.created_at).toLocaleDateString()}
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
                  {negotiation.messages?.length || 0} Messages
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NegotiationList;
