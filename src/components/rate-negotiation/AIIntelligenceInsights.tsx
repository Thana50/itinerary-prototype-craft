
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Star } from "lucide-react";

const AIIntelligenceInsights = () => {
  return (
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
  );
};

export default AIIntelligenceInsights;
