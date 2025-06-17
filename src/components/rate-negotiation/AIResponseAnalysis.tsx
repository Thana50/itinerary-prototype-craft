
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, AlertTriangle, TrendingUp, Clock, DollarSign, Star } from "lucide-react";

interface AIResponseAnalysisProps {
  negotiation: any;
  providerResponse: any;
  onActionSelect: (action: string) => void;
}

const AIResponseAnalysis = ({ negotiation, providerResponse, onActionSelect }: AIResponseAnalysisProps) => {
  const calculateVariance = () => {
    const variance = providerResponse.rate - negotiation.targetRate;
    const percentage = ((variance / negotiation.targetRate) * 100).toFixed(1);
    return { variance, percentage };
  };

  const getOverallRating = () => {
    const { percentage } = calculateVariance();
    const variancePercent = Math.abs(Number(percentage));
    
    if (variancePercent <= 10) return { rating: "EXCELLENT OFFER", color: "bg-green-500", confidence: 95 };
    if (variancePercent <= 20) return { rating: "GOOD OFFER", color: "bg-green-400", confidence: 87 };
    if (variancePercent <= 30) return { rating: "FAIR OFFER", color: "bg-yellow-500", confidence: 72 };
    return { rating: "POOR OFFER", color: "bg-red-500", confidence: 45 };
  };

  const getValueAddAnalysis = () => {
    const benefits = [];
    const concerns = [];
    
    if (providerResponse.terms.includes("breakfast")) {
      benefits.push({ item: "Includes breakfast", value: "$25/person/day" });
    }
    if (providerResponse.terms.includes("transfers")) {
      benefits.push({ item: "Includes transfers", value: "$45 one-way" });
    }
    if (providerResponse.terms.includes("halal")) {
      benefits.push({ item: "Confirms halal dining availability", value: "Cultural requirement met" });
    }
    if (providerResponse.terms.includes("50% deposit")) {
      concerns.push({ item: "Requires 50% deposit", suggestion: "Negotiate to 25%" });
    }
    
    return { benefits, concerns };
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

  const { variance, percentage } = calculateVariance();
  const overallRating = getOverallRating();
  const valueAnalysis = getValueAddAnalysis();
  const recommendations = getAIRecommendations();

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-purple-600 mr-2" />
              <CardTitle className="text-purple-900">AI Response Analysis</CardTitle>
            </div>
            <Badge className={`${overallRating.color} text-white`}>
              {overallRating.rating}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-purple-700">Rate Variance</p>
                <p className="font-semibold text-purple-900">
                  ${Math.abs(variance)} ({percentage}% {variance > 0 ? 'above' : 'below'} target)
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-purple-700">Market Position</p>
                <p className="font-semibold text-purple-900">6% above average</p>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-purple-700">Confidence</p>
                <p className="font-semibold text-purple-900">{overallRating.confidence}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Value-Add Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Value-Add Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {valueAnalysis.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">{benefit.item}</span>
                <span className="text-sm text-green-600 ml-auto">Value: {benefit.value}</span>
              </div>
            ))}
            {valueAnalysis.concerns.map((concern, idx) => (
              <div key={idx} className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                <span className="text-sm text-gray-700">{concern.item}</span>
                <span className="text-sm text-orange-600 ml-auto">{concern.suggestion}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
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

      {/* AI Intelligence Insights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">AI Intelligence Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">Best to respond within 4 hours for higher success rate</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">This provider typically accepts counter-offers (78% success rate)</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">Strong relationship - 5 previous successful negotiations</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIResponseAnalysis;
