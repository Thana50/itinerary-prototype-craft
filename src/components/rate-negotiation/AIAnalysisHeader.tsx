
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, DollarSign, TrendingUp, Star } from "lucide-react";

interface AIAnalysisHeaderProps {
  negotiation: any;
  providerResponse: any;
  overallRating: {
    rating: string;
    color: string;
    confidence: number;
  };
  variance: number;
  percentage: string;
}

const AIAnalysisHeader = ({ 
  negotiation, 
  providerResponse, 
  overallRating, 
  variance, 
  percentage 
}: AIAnalysisHeaderProps) => {
  return (
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
  );
};

export default AIAnalysisHeader;
