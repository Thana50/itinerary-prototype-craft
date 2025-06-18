import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProviderResponseSimulator from "./ProviderResponseSimulator";
import AIResponseAnalysis from "./AIResponseAnalysis";
import CommunicationTimeline from "./CommunicationTimeline";
import NegotiationTimeline from "./NegotiationTimeline";
import CompletionWizard from "./CompletionWizard";
import NegotiationHeader from "./NegotiationHeader";
import NegotiationDetails from "./NegotiationDetails";
import AIAnalysisPanel from "./AIAnalysisPanel";
import NegotiationActions from "./NegotiationActions";

interface ActiveNegotiation {
  id: number;
  provider: string;
  service: string;
  serviceType: "hotel" | "tour" | "transfer";
  originalRate: number;
  targetRate: number;
  currentOffer: number;
  status: string;
  statusColor: string;
  lastUpdate: string;
  groupSize: number;
  duration: number;
}

interface ActiveNegotiationCardProps {
  negotiation: ActiveNegotiation;
}

const ActiveNegotiationCard = ({ negotiation }: ActiveNegotiationCardProps) => {
  const [showSimulator, setShowSimulator] = useState(false);
  const [providerResponse, setProviderResponse] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showCommunicationTimeline, setShowCommunicationTimeline] = useState(false);
  const [showNegotiationTimeline, setShowNegotiationTimeline] = useState(false);
  const [showCompletionWizard, setShowCompletionWizard] = useState(false);

  const handleProviderResponse = (response: any) => {
    setProviderResponse(response);
    setShowSimulator(false);
    setShowAnalysis(true);
    console.log('Provider response received:', response);
  };

  const handleActionSelect = (actionId: string) => {
    console.log('Action selected:', actionId);
    // Here you would implement the actual action logic
  };

  const isNegotiationAccepted = negotiation.status === "Accepted" || negotiation.status === "Negotiating";

  if (showAnalysis && providerResponse) {
    return (
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-semibold text-purple-900">
                  {negotiation.provider} - Provider Response Received
                </div>
                <div className="text-gray-600 mt-1">
                  {negotiation.service}
                </div>
              </div>
              <div className="flex gap-2">
                {isNegotiationAccepted && (
                  <Button 
                    onClick={() => setShowCompletionWizard(true)}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Complete Negotiation
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAnalysis(false)}
                >
                  Back to Negotiation
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 border rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Provider Response:</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{providerResponse.message}</p>
              <div className="mt-3 flex items-center gap-4">
                <div className="bg-blue-500 text-white inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  Offered Rate: ${providerResponse.rate}/night
                </div>
                <div className="text-foreground border inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  Response Time: {providerResponse.responseTime}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <AIResponseAnalysis 
          negotiation={negotiation}
          providerResponse={providerResponse}
          onActionSelect={handleActionSelect}
        />
      </div>
    );
  }

  return (
    <>
      <Card className="bg-white">
        <CardHeader>
          <div className="flex justify-between items-start">
            <NegotiationHeader negotiation={negotiation} />
            {isNegotiationAccepted && (
              <Button 
                onClick={() => setShowCompletionWizard(true)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                Complete Negotiation
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <NegotiationDetails negotiation={negotiation} />
          <AIAnalysisPanel negotiation={negotiation} />
          <NegotiationActions 
            negotiation={negotiation}
            onShowCommunicationTimeline={() => setShowCommunicationTimeline(true)}
            onShowNegotiationTimeline={() => setShowNegotiationTimeline(true)}
            onShowSimulator={() => setShowSimulator(true)}
          />
        </CardContent>
      </Card>

      <ProviderResponseSimulator
        isOpen={showSimulator}
        onClose={() => setShowSimulator(false)}
        negotiation={negotiation}
        onResponseSubmit={handleProviderResponse}
      />

      <CommunicationTimeline
        isOpen={showCommunicationTimeline}
        onClose={() => setShowCommunicationTimeline(false)}
        negotiation={negotiation}
      />

      <NegotiationTimeline
        isOpen={showNegotiationTimeline}
        onClose={() => setShowNegotiationTimeline(false)}
        negotiation={negotiation}
      />

      <CompletionWizard
        isOpen={showCompletionWizard}
        onClose={() => setShowCompletionWizard(false)}
        negotiation={negotiation}
      />
    </>
  );
};

export default ActiveNegotiationCard;
