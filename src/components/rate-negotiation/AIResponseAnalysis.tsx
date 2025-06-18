
import React from "react";
import AIAnalysisHeader from "./AIAnalysisHeader";
import ValueAddAnalysis from "./ValueAddAnalysis";
import AIRecommendations from "./AIRecommendations";
import AIIntelligenceInsights from "./AIIntelligenceInsights";

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

  const { variance, percentage } = calculateVariance();
  const overallRating = getOverallRating();

  return (
    <div className="space-y-6">
      <AIAnalysisHeader 
        negotiation={negotiation}
        providerResponse={providerResponse}
        overallRating={overallRating}
        variance={variance}
        percentage={percentage}
      />

      <ValueAddAnalysis providerResponse={providerResponse} />

      <AIRecommendations 
        negotiation={negotiation}
        providerResponse={providerResponse}
        onActionSelect={onActionSelect}
      />

      <AIIntelligenceInsights />
    </div>
  );
};

export default AIResponseAnalysis;
