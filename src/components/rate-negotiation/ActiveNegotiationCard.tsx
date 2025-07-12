
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Brain } from "lucide-react";
import AIAnalysisPanel from "./AIAnalysisPanel";
import PredictiveAnalyticsPanel from "./PredictiveAnalyticsPanel";
import type { ActiveNegotiation } from "@/types/negotiation";

interface ActiveNegotiationCardProps {
  negotiation: ActiveNegotiation;
}

const ActiveNegotiationCard = ({ negotiation }: ActiveNegotiationCardProps) => {
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showPredictiveAnalytics, setShowPredictiveAnalytics] = useState(false);

  const calculateSavings = () => {
    if (negotiation.currentOffer > 0) {
      return ((negotiation.originalRate - negotiation.currentOffer) / negotiation.originalRate) * 100;
    }
    return ((negotiation.originalRate - negotiation.targetRate) / negotiation.originalRate) * 100;
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{negotiation.service}</CardTitle>
            <p className="text-sm text-gray-600">{negotiation.provider}</p>
          </div>
          <div className="text-right">
            <Badge className={negotiation.statusColor}>{negotiation.status}</Badge>
            <p className="text-xs text-gray-500 mt-1">{negotiation.lastUpdate}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">Original Rate</p>
            <p className="font-semibold">${negotiation.originalRate}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Target Rate</p>
            <p className="font-semibold text-green-600">${negotiation.targetRate}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Current Offer</p>
            <p className="font-semibold text-blue-600">
              {negotiation.currentOffer > 0 ? `$${negotiation.currentOffer}` : 'Pending'}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="text-gray-600">Potential Savings: </span>
            <span className="font-semibold text-green-600">
              {calculateSavings().toFixed(1)}%
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Group: {negotiation.groupSize} people
          </div>
        </div>

        <AIAnalysisPanel negotiation={negotiation} />

        <div className="flex gap-2 mt-4">
          <Collapsible open={showPredictiveAnalytics} onOpenChange={setShowPredictiveAnalytics}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Enhanced AI Analysis
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <PredictiveAnalyticsPanel 
                negotiationId={negotiation.id}
                context={{
                  serviceType: negotiation.serviceType,
                  originalRate: negotiation.originalRate,
                  targetRate: negotiation.targetRate,
                  currentOffer: negotiation.currentOffer,
                  provider: negotiation.provider
                }}
              />
            </CollapsibleContent>
          </Collapsible>
          
          <Button variant="default" size="sm">
            View Details
          </Button>
          
          <Button variant="outline" size="sm">
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveNegotiationCard;
