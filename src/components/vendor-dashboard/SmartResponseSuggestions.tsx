
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp } from "lucide-react";

interface SmartResponseSuggestionsProps {
  negotiation: any;
}

const SmartResponseSuggestions = ({ negotiation }: SmartResponseSuggestionsProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg text-purple-900">Intelligent Suggestions for this Request</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
            <p className="text-sm text-purple-800">
              <strong>Similar requests:</strong> Average accepted rate is $165/night (8% below market)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
            <p className="text-sm text-purple-800">
              <strong>Agency relationship:</strong> {negotiation.partnerLevel} with 89% booking conversion rate
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
            <p className="text-sm text-purple-800">
              <strong>Seasonal factor:</strong> Shoulder season allows 10-15% flexibility
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
            <p className="text-sm text-purple-800">
              <strong>Competition check:</strong> Nearby properties offering $160-170/night
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
            <p className="text-sm text-purple-800">
              <strong>Revenue impact:</strong> Accepting builds relationship for higher-value bookings
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-gray-900">Recommended Response: Counter at $165/night</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500 text-white">Success Probability: 87%</Badge>
            <span className="text-sm text-gray-600">Builds relationship while maintaining profitability</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartResponseSuggestions;
