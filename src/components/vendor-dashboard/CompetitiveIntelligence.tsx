
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";

const CompetitiveIntelligence = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">Market Intelligence</CardTitle>
        <p className="text-sm text-gray-600">Make informed decisions with market data</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Market Rate Range</span>
          </div>
          <p className="text-sm text-blue-800">$155-185/night for similar properties</p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-900">Competitor Offers</span>
          </div>
          <p className="text-sm text-green-800">Resort A: $170/night</p>
          <p className="text-sm text-green-800">Resort B: $175/night</p>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-purple-900">Agency Volume</span>
          </div>
          <p className="text-sm text-purple-800">45 room nights/month in Phuket area</p>
        </div>

        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-orange-600" />
            <span className="font-medium text-orange-900">Seasonal Demand</span>
          </div>
          <p className="text-sm text-orange-800">78% occupancy forecast for these dates</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitiveIntelligence;
