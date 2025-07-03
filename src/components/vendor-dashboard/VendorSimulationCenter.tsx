
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Play, Book, Target, Users, TrendingUp } from "lucide-react";

interface SimulationScenario {
  id: string;
  title: string;
  difficulty: number;
  difficultyLabel: string;
  agency: string;
  request: string;
  context: string;
  learningGoal: string;
}

interface VendorSimulationCenterProps {
  onStartSimulation: (scenarioId: string) => void;
}

const VendorSimulationCenter = ({ onStartSimulation }: VendorSimulationCenterProps) => {
  const scenarios: SimulationScenario[] = [
    {
      id: "high-value-repeat",
      title: "High-Value Repeat Client",
      difficulty: 2,
      difficultyLabel: "Easy",
      agency: "Travia Travel (Gold Partner)",
      request: "$140/night vs $160 market rate",
      context: "Client books 50+ nights/year with your property",
      learningGoal: "Balance relationship building with profitability"
    },
    {
      id: "new-agency-partnership",
      title: "New Agency Partnership",
      difficulty: 3,
      difficultyLabel: "Medium",
      agency: "Desert Dreams Travel (No history)",
      request: "$125/night vs $155 market rate",
      context: "New agency promising 100+ nights/year",
      learningGoal: "Evaluate new partnership opportunities"
    },
    {
      id: "peak-season-pressure",
      title: "Peak Season Pressure",
      difficulty: 4,
      difficultyLabel: "Hard",
      agency: "Multiple agencies competing",
      request: "$180/night vs $220 peak rate",
      context: "High demand period, limited availability",
      learningGoal: "Maximize revenue during peak times"
    },
    {
      id: "cultural-requirements",
      title: "Cultural Requirements Specialist",
      difficulty: 3,
      difficultyLabel: "Medium",
      agency: "Islamic Travel Specialists",
      request: "$135/night + cultural accommodations",
      context: "Requires halal dining, prayer facilities, family areas",
      learningGoal: "Value cultural accommodation services"
    },
    {
      id: "group-booking",
      title: "Group Booking Opportunity",
      difficulty: 4,
      difficultyLabel: "Hard",
      agency: "Corporate travel department",
      request: "$110/night for 40 rooms over 3 dates",
      context: "Large volume but low margin",
      learningGoal: "Evaluate bulk booking profitability"
    }
  ];

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return "bg-green-500";
    if (difficulty === 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-purple-600" />
            <CardTitle className="text-2xl text-gray-800">Negotiation Training Center</CardTitle>
          </div>
          <p className="text-gray-600">Practice your negotiation skills with realistic scenarios and get expert feedback</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="border border-gray-200 hover:border-purple-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-800">{scenario.title}</h3>
                    <Badge className={`${getDifficultyColor(scenario.difficulty)} text-white`}>
                      {scenario.difficultyLabel}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-sm text-gray-600 mr-2">Difficulty:</span>
                    {renderStars(scenario.difficulty)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Agency:</span>
                      <p className="text-sm text-gray-600">{scenario.agency}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Request:</span>
                      <p className="text-sm text-gray-600">{scenario.request}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Context:</span>
                      <p className="text-sm text-gray-600">{scenario.context}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-purple-700">Learning Goal:</span>
                      <p className="text-sm text-purple-600 font-medium">{scenario.learningGoal}</p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => onStartSimulation(scenario.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Simulation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <VendorStrategyGuide />
    </div>
  );
};

const VendorStrategyGuide = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Book className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-xl text-gray-800">Negotiation Strategy Guide</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Relationship Tiers
            </h4>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="font-medium text-yellow-800">Gold Partners (3+ years):</span>
                <p className="text-yellow-700">Up to 25% flexibility</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-800">Silver Partners (1-3 years):</span>
                <p className="text-gray-700">Up to 15% flexibility</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-medium text-blue-800">New Partners:</span>
                <p className="text-blue-700">Up to 10% flexibility with volume proof</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Seasonal Adjustments
            </h4>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="font-medium text-red-800">Peak Season:</span>
                <p className="text-red-700">Maximum 5% discount for top partners</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="font-medium text-orange-800">Shoulder Season:</span>
                <p className="text-orange-700">Up to 20% flexibility available</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="font-medium text-green-800">Low Season:</span>
                <p className="text-green-700">Aggressive rates acceptable for volume</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">💡 Value-Add Strategies</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Breakfast inclusion often perceived as 25-30% value</li>
              <li>• Airport transfers valued at $45-60 by Middle Eastern clients</li>
              <li>• Cultural accommodations can justify premium pricing</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">🎯 Competitive Positioning</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Track competitor rates weekly during peak seasons</li>
              <li>• Maintain 5-10% premium for superior cultural services</li>
              <li>• Match competitor rates only for strategic partnerships</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorSimulationCenter;
