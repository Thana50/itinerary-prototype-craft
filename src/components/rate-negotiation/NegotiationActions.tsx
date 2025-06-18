
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Zap } from "lucide-react";

interface NegotiationActionsProps {
  negotiation: any;
  onShowCommunicationTimeline: () => void;
  onShowNegotiationTimeline: () => void;
  onShowSimulator: () => void;
}

const NegotiationActions = ({ 
  negotiation, 
  onShowCommunicationTimeline, 
  onShowNegotiationTimeline,
  onShowSimulator 
}: NegotiationActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 pt-4 border-t">
      <Button 
        size="sm" 
        variant="outline"
        onClick={onShowCommunicationTimeline}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        View Timeline
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={onShowNegotiationTimeline}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Timeline View
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={onShowSimulator}
      >
        <Zap className="h-4 w-4 mr-2" />
        Simulate Response
      </Button>
    </div>
  );
};

export default NegotiationActions;
