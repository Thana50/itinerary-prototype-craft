
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, MessageCircle, ExternalLink, Settings } from "lucide-react";
import { aiNegotiationService, type NegotiationContext } from "@/services/aiNegotiationService";

interface ActiveNegotiation {
  id: number;
  serviceType: "hotel" | "tour" | "transfer";
  originalRate: number;
  targetRate: number;
  currentOffer: number;
  provider: string;
  service: string;
  groupSize: number;
  duration: number;
  lastUpdate: string;
}

interface NegotiationActionsProps {
  negotiation: ActiveNegotiation;
  onShowCommunicationTimeline: () => void;
  onShowSimulator: () => void;
}

const NegotiationActions = ({ 
  negotiation, 
  onShowCommunicationTimeline, 
  onShowSimulator 
}: NegotiationActionsProps) => {
  const openProviderPortal = () => {
    const portalUrl = `/provider-portal/${negotiation.id}`;
    window.open(portalUrl, '_blank', 'width=1200,height=800');
  };

  const getAIRecommendation = () => {
    const context: NegotiationContext = {
      serviceType: negotiation.serviceType,
      originalRate: negotiation.originalRate,
      targetRate: negotiation.targetRate,
      currentOffer: negotiation.currentOffer,
      provider: negotiation.provider,
      service: negotiation.service,
      groupSize: negotiation.groupSize,
      duration: negotiation.duration
    };

    if (negotiation.currentOffer > 0) {
      const analysis = aiNegotiationService.analyzeOffer(context);
      return analysis.recommendation;
    }
    return null;
  };

  const recommendation = getAIRecommendation();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-1" />
        Last updated {negotiation.lastUpdate}
      </div>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={onShowCommunicationTimeline}
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          View Timeline
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={openProviderPortal}
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Provider Portal
        </Button>
        {negotiation.currentOffer === 0 ? (
          <>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onShowSimulator}
            >
              <Settings className="h-4 w-4 mr-1" />
              Simulate Response
            </Button>
            <Button size="sm" variant="outline">Follow Up</Button>
            <Button size="sm" variant="outline">Modify Request</Button>
          </>
        ) : (
          <>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onShowSimulator}
            >
              <Settings className="h-4 w-4 mr-1" />
              Simulate Response
            </Button>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {recommendation === 'accept' ? 'Accept Offer' : 
               recommendation === 'counter' ? 'Smart Counter' : 'Reject & Counter'}
            </Button>
            <Button size="sm" variant="outline">Manual Override</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default NegotiationActions;
