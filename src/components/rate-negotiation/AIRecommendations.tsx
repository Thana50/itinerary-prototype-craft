
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AIRecommendationsProps {
  negotiation: any;
  providerResponse: any;
  onActionSelect: (action: string) => void;
}

const AIRecommendations = ({ negotiation, providerResponse, onActionSelect }: AIRecommendationsProps) => {
  const calculateVariance = () => {
    const variance = providerResponse.rate - negotiation.targetRate;
    const percentage = ((variance / negotiation.targetRate) * 100).toFixed(1);
    return { variance, percentage };
  };

  const getAIRecommendations = () => {
    const { percentage } = calculateVariance();
    const variancePercent = Number(percentage);
    
    if (variancePercent <= 10) {
      return {
        action: "ACCEPT OFFER",
        reasoning: "Rate is within acceptable range with good value-adds",
        options: [
          {
            id: "accept",
            title: "Accept Offer",
            description: `Accept $${providerResponse.rate}/night rate as offered`,
            details: "Total value with inclusions equivalent to target rate",
            action: "Send acceptance email automatically",
            recommended: true
          }
        ]
      };
    } else if (variancePercent <= 25) {
      return {
        action: "COUNTER OFFER",
        reasoning: "Good baseline offer with room for improvement",
        options: [
          {
            id: "counter_terms",
            title: "Accept Rate, Negotiate Terms",
            description: `Accept $${providerResponse.rate}/night but improve deposit terms`,
            details: "Request 25% deposit instead of 50%",
            action: "Send terms counter-proposal",
            recommended: true
          },
          {
            id: "counter_rate",
            title: "Counter Rate",
            description: `Counter with $${Math.round(negotiation.targetRate + (providerResponse.rate - negotiation.targetRate) * 0.5)}/night`,
            details: "Split the difference approach",
            action: "Send rate counter-offer"
          }
        ]
      };
    } else {
      return {
        action: "REJECT & NEGOTIATE",
        reasoning: "Rate too high, significant negotiation needed",
        options: [
          {
            id: "firm_counter",
            title: "Firm Counter Offer",
            description: `Counter with $${negotiation.targetRate + 10}/night citing market rates`,
            details: "Highlight volume business opportunity",
            action: "Send competitive counter-offer",
            recommended: true
          },
          {
            id: "seek_alternatives",
            title: "Seek Alternatives",
            description: "Explore other providers with better rates",
            details: "Maintain this as backup option",
            action: "Research alternative providers"
          }
        ]
      };
    }
  };

  const recommendations = getAIRecommendations();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Recommended Actions</CardTitle>
        <p className="text-sm text-gray-600">{recommendations.reasoning}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.options.map((option, idx) => (
            <Card key={option.id} className={`border ${option.recommended ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-semibold text-gray-900">{option.title}</h4>
                      {option.recommended && (
                        <Badge className="ml-2 bg-purple-600 text-white">Recommended</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{option.details}</p>
                    <p className="text-xs text-purple-600 mt-2 italic">Action: {option.action}</p>
                  </div>
                  <div className="ml-4 space-y-2">
                    <Button 
                      size="sm"
                      onClick={() => onActionSelect(option.id)}
                      className={option.recommended ? "bg-purple-600 hover:bg-purple-700" : ""}
                      variant={option.recommended ? "default" : "outline"}
                    >
                      Select
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Success: {option.recommended ? '78%' : '65%'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
