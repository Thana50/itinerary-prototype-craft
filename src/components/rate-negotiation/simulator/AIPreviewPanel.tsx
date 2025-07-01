
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, TrendingUp } from "lucide-react";

interface AIPreviewPanelProps {
  insights: {
    variance: number;
    percentage: string;
    marketComparison: string;
    assessment: string;
  };
  responseType: string;
  responseTime: string;
}

const AIPreviewPanel = ({ insights, responseType, responseTime }: AIPreviewPanelProps) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-sm text-blue-900 flex items-center">
          <Brain className="h-4 w-4 mr-2" />
          AI Analysis Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-blue-700">Rate Variance:</span>
          <Badge className={`text-xs ${Math.abs(insights.variance) <= 15 ? 'bg-green-500' : Math.abs(insights.variance) <= 25 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
            ${Math.abs(insights.variance)} ({insights.percentage}%)
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-blue-700">Assessment:</span>
          <span className="text-xs font-medium text-blue-900">{insights.assessment}</span>
        </div>
        <div className="text-xs text-blue-600 italic">{insights.marketComparison}</div>
        
        <div className="pt-2 border-t border-blue-200">
          <div className="flex items-center text-xs text-blue-700 mb-1">
            <Clock className="h-3 w-3 mr-1" />
            Response Pattern
          </div>
          <p className="text-xs text-blue-600">This provider typically responds within {responseTime.toLowerCase()}</p>
        </div>

        <div className="pt-2 border-t border-blue-200">
          <div className="flex items-center text-xs text-blue-700 mb-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            Success Probability
          </div>
          <p className="text-xs text-blue-600">
            {responseType === "Counter Offer" ? "78%" : responseType === "Accept Target Rate" ? "95%" : "45%"} chance of favorable outcome
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPreviewPanel;
