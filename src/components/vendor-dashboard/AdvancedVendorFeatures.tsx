
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Lightbulb, 
  BarChart3, 
  Users, 
  Clock,
  Award,
  Zap,
  Eye,
  MessageSquare
} from "lucide-react";
import CompetitiveIntelligence from "./CompetitiveIntelligence";
import SmartResponseSuggestions from "./SmartResponseSuggestions";
import ValueAddEnhancements from "./ValueAddEnhancements";
import VendorPerformanceInsights from "./VendorPerformanceInsights";

interface AdvancedVendorFeaturesProps {
  vendorId: string;
  activeNegotiations?: any[];
  onFeatureAction?: (action: string, data: any) => void;
}

const AdvancedVendorFeatures = ({ 
  vendorId, 
  activeNegotiations = [], 
  onFeatureAction 
}: AdvancedVendorFeaturesProps) => {
  const [selectedTab, setSelectedTab] = useState("intelligence");
  const [competitiveData, setCompetitiveData] = useState(null);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [valueAdds, setValueAdds] = useState<string[]>([]);

  // Mock competitive intelligence data
  useEffect(() => {
    const mockCompetitiveData = {
      marketPosition: {
        rank: 2,
        totalCompetitors: 15,
        marketShare: 18.5,
        averageRate: 165,
        yourRate: 170,
        competitorRates: [
          { name: "Resort Paradise", rate: 160, occupancy: 85 },
          { name: "Ocean Breeze Hotel", rate: 172, occupancy: 78 },
          { name: "Sunset Villa", rate: 158, occupancy: 92 }
        ]
      },
      demandForecast: {
        nextWeek: { demand: "High", confidence: 89 },
        nextMonth: { demand: "Medium", confidence: 76 },
        peakDates: ["2025-03-15", "2025-03-22", "2025-04-10"]
      },
      pricingOpportunities: [
        {
          type: "Premium Positioning",
          description: "You can increase rates by 8-12% during peak dates",
          impact: "+$2,400 monthly revenue",
          confidence: 87
        },
        {
          type: "Value Bundle",
          description: "Offer breakfast + transfer package at $45 premium",
          impact: "+15% booking conversion",
          confidence: 92
        }
      ]
    };
    setCompetitiveData(mockCompetitiveData);
  }, [vendorId]);

  // Generate smart suggestions based on active negotiations
  useEffect(() => {
    if (activeNegotiations.length > 0) {
      const suggestions = activeNegotiations.map(negotiation => ({
        id: negotiation.id,
        type: "counter_strategy",
        priority: "high",
        title: `Smart Counter for ${negotiation.agency}`,
        description: `Based on their booking history, counter at $${negotiation.requestedRate + 15}`,
        successProbability: 84,
        reasoning: [
          "Agency has 89% acceptance rate at this price point",
          "Similar requests accepted within 12% of market rate",
          "Peak season allows 10-15% premium pricing"
        ],
        suggestedActions: [
          "Include complimentary breakfast",
          "Offer flexible cancellation",
          "Add welcome amenity"
        ]
      }));
      setSmartSuggestions(suggestions);
    }
  }, [activeNegotiations]);

  const handleValueAddChange = (valueAddId: string, checked: boolean) => {
    if (checked) {
      setValueAdds(prev => [...prev, valueAddId]);
    } else {
      setValueAdds(prev => prev.filter(id => id !== valueAddId));
    }
    
    if (onFeatureAction) {
      onFeatureAction('value_add_updated', { valueAddId, checked });
    }
  };

  const handleApplySuggestion = (suggestionId: string) => {
    if (onFeatureAction) {
      onFeatureAction('apply_suggestion', { suggestionId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Feature Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Market Intel</h3>
                <p className="text-sm text-blue-700">Real-time insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900">Smart Suggestions</h3>
                <p className="text-sm text-purple-700">{smartSuggestions.length} active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Value Adds</h3>
                <p className="text-sm text-green-700">{valueAdds.length} selected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">Performance</h3>
                <p className="text-sm text-orange-700">Top 10% vendor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Feature Tabs */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Advanced Vendor Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger 
                value="intelligence" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Market Intelligence
              </TabsTrigger>
              <TabsTrigger 
                value="suggestions" 
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Smart Suggestions
              </TabsTrigger>
              <TabsTrigger 
                value="valueadds" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Zap className="h-4 w-4 mr-2" />
                Value Adds
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="intelligence">
              <CompetitiveIntelligence />
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              {smartSuggestions.length > 0 ? (
                smartSuggestions.map((suggestion) => (
                  <SmartResponseSuggestions
                    key={suggestion.id}
                    negotiation={suggestion}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No Active Suggestions</h3>
                  <p>Smart suggestions will appear here when you have active negotiations.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="valueadds">
              <ValueAddEnhancements
                valueAdds={valueAdds}
                onValueAddChange={handleValueAddChange}
              />
            </TabsContent>

            <TabsContent value="performance">
              <VendorPerformanceInsights vendorId={vendorId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Action Panel */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => onFeatureAction?.('optimize_pricing', {})}
            >
              <Target className="h-4 w-4 mr-2" />
              Optimize Pricing
            </Button>
            <Button 
              variant="outline" 
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              onClick={() => onFeatureAction?.('analyze_competition', {})}
            >
              <Eye className="h-4 w-4 mr-2" />
              Analyze Competition
            </Button>
            <Button 
              variant="outline" 
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              onClick={() => onFeatureAction?.('export_insights', {})}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Insights
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedVendorFeatures;
