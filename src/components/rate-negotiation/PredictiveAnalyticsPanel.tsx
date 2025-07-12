
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Target, Clock, AlertCircle } from "lucide-react";
import { enhancedAIDecisionEngine } from "@/services/enhancedAIDecisionEngine";

interface PredictiveAnalyticsPanelProps {
  negotiationId: string;
  context: {
    serviceType: string;
    originalRate: number;
    targetRate: number;
    currentOffer: number;
    provider: string;
  };
}

const PredictiveAnalyticsPanel = ({ negotiationId, context }: PredictiveAnalyticsPanelProps) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPredictiveAnalytics();
  }, [negotiationId, context]);

  const loadPredictiveAnalytics = async () => {
    try {
      setIsLoading(true);
      const decision = await enhancedAIDecisionEngine.analyzeNegotiation({
        serviceType: context.serviceType as any,
        originalRate: context.originalRate,
        targetRate: context.targetRate,
        currentOffer: context.currentOffer,
        provider: context.provider,
        service: context.serviceType,
        vendorId: 'vendor-123' // Would come from actual context
      });
      setAnalytics(decision);
    } catch (error) {
      console.error('Error loading predictive analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Brain className="h-6 w-6 animate-pulse text-purple-600 mr-2" />
            <span>Analyzing negotiation patterns...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return null;
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'accept': return 'bg-green-500';
      case 'counter': return 'bg-blue-500';
      case 'reject': return 'bg-red-500';
      case 'escalate': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Recommendation */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-purple-600 mr-2" />
              <CardTitle className="text-purple-900">AI Recommendation</CardTitle>
            </div>
            <Badge className={`${getRecommendationColor(analytics.recommendation)} text-white`}>
              {analytics.recommendation.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence Level</span>
              <span className="text-sm font-bold">{Math.round(analytics.confidence * 100)}%</span>
            </div>
            <Progress value={analytics.confidence * 100} className="h-2" />
            
            <div className="mt-4">
              <h4 className="font-medium text-purple-900 mb-2">Reasoning:</h4>
              <ul className="space-y-1">
                {analytics.reasoning.map((reason: string, idx: number) => (
                  <li key={idx} className="text-sm text-purple-700 flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Intelligence */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            <CardTitle>Market Intelligence</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600">Market Average</p>
              <p className="text-lg font-bold text-blue-900">
                ${analytics.marketIntelligence.averageRate.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600">Demand Level</p>
              <p className="text-lg font-bold text-green-900 capitalize">
                {analytics.marketIntelligence.demandLevel}
              </p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-600">Seasonal Trend</p>
              <p className="text-lg font-bold text-yellow-900 capitalize">
                {analytics.marketIntelligence.seasonalTrend}
              </p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-600">Success Rate</p>
              <p className="text-lg font-bold text-purple-900">
                {Math.round(analytics.riskAssessment.successProbability * 100)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Strategy */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Target className="h-5 w-5 text-green-600 mr-2" />
            <CardTitle>Pricing Strategy</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Suggested Counter</span>
              <span className="font-bold text-green-600">
                ${analytics.pricingStrategy.suggestedCounter.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Max Acceptable</span>
              <span className="font-bold text-yellow-600">
                ${analytics.pricingStrategy.maxAcceptable.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Walk Away Point</span>
              <span className="font-bold text-red-600">
                ${analytics.pricingStrategy.walkAwayPoint.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected Rounds</span>
              <span className="font-bold text-blue-600">
                {analytics.pricingStrategy.negotiationRounds}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timing Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-orange-600 mr-2" />
            <CardTitle>Timing Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Optimal Timing</span>
              <Badge variant="outline">{analytics.timingAnalysis.optimalTiming}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Urgency Level</span>
              <Badge 
                className={
                  analytics.timingAnalysis.urgencyLevel === 'high' ? 'bg-red-500 text-white' :
                  analytics.timingAnalysis.urgencyLevel === 'medium' ? 'bg-yellow-500 text-white' :
                  'bg-green-500 text-white'
                }
              >
                {analytics.timingAnalysis.urgencyLevel}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Market Conditions:</span>
              <p>{analytics.timingAnalysis.marketConditions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <CardTitle>Risk Assessment</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Alternative Options</span>
              <span className="font-bold">{analytics.riskAssessment.alternativeOptions} vendors</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Relationship Impact</span>
              <Badge 
                className={
                  analytics.riskAssessment.relationshipImpact === 'positive' ? 'bg-green-500 text-white' :
                  analytics.riskAssessment.relationshipImpact === 'negative' ? 'bg-red-500 text-white' :
                  'bg-gray-500 text-white'
                }
              >
                {analytics.riskAssessment.relationshipImpact}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {analytics.nextSteps.map((step: string, idx: number) => (
              <li key={idx} className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full mr-3 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalyticsPanel;
