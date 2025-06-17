
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Clock, Copy, Check } from "lucide-react";
import { aiNegotiationService, type NegotiationContext } from "@/services/aiNegotiationService";

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
  const [copiedStrategy, setCopiedStrategy] = useState<boolean>(false);

  const generateAIAnalysis = () => {
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

    if (negotiation.currentOffer === 0) {
      const strategy = aiNegotiationService.generateStrategy(context);
      return {
        type: 'strategy',
        content: strategy.approach,
        details: strategy.leveragePoints[0]
      };
    } else {
      const analysis = aiNegotiationService.analyzeOffer(context);
      return {
        type: 'analysis',
        content: analysis.reasoning,
        details: analysis.marketIntelligence,
        recommendation: analysis.recommendation,
        nextSteps: analysis.nextSteps
      };
    }
  };

  const copyNegotiationStrategy = async () => {
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

    const strategy = aiNegotiationService.generateStrategy(context);
    const message = aiNegotiationService.generateNegotiationMessage(strategy, context);

    try {
      await navigator.clipboard.writeText(message);
      setCopiedStrategy(true);
      setTimeout(() => setCopiedStrategy(false), 2000);
    } catch (err) {
      console.error('Failed to copy strategy:', err);
    }
  };

  const aiAnalysis = generateAIAnalysis();

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-purple-900">
              {negotiation.provider}
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              {negotiation.service}
            </CardDescription>
          </div>
          <Badge className={`${negotiation.statusColor} text-white`}>
            {negotiation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Original Rate</p>
            <p className="font-semibold text-gray-900">${negotiation.originalRate}{negotiation.serviceType === 'hotel' ? '/night' : negotiation.serviceType === 'tour' ? ' total' : ''}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Target Rate</p>
            <p className="font-semibold text-green-600">${negotiation.targetRate}{negotiation.serviceType === 'hotel' ? '/night' : negotiation.serviceType === 'tour' ? ' total' : ''}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Offer</p>
            <p className="font-semibold text-blue-600">
              {negotiation.currentOffer === 0 ? "Pending Response" : `$${negotiation.currentOffer}${negotiation.serviceType === 'hotel' ? '/night' : negotiation.serviceType === 'tour' ? ' total' : ''}`}
            </p>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1">
              <Brain className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-purple-900 text-sm">
                  AI {aiAnalysis.type === 'strategy' ? 'Strategy' : 'Analysis'}
                </p>
                <p className="text-purple-700 text-sm mt-1">{aiAnalysis.content}</p>
                <p className="text-purple-600 text-xs mt-2 italic">{aiAnalysis.details}</p>
                {aiAnalysis.type === 'analysis' && aiAnalysis.nextSteps && (
                  <div className="mt-2">
                    <p className="text-purple-800 text-xs font-medium">Recommended Actions:</p>
                    <ul className="text-purple-600 text-xs mt-1 list-disc list-inside">
                      {aiAnalysis.nextSteps.slice(0, 2).map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyNegotiationStrategy}
              className="ml-2 h-8 w-8 p-0"
            >
              {copiedStrategy ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-purple-600" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            Last updated {negotiation.lastUpdate}
          </div>
          <div className="flex gap-2">
            {negotiation.currentOffer === 0 ? (
              <>
                <Button size="sm" variant="outline">Follow Up</Button>
                <Button size="sm" variant="outline">Modify Request</Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {aiAnalysis.recommendation === 'accept' ? 'Accept Offer' : 
                   aiAnalysis.recommendation === 'counter' ? 'Smart Counter' : 'Reject & Counter'}
                </Button>
                <Button size="sm" variant="outline">Manual Override</Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveNegotiationCard;
