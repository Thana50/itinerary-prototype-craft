
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Target, BarChart3, CheckCircle, AlertTriangle, TrendingUp, Trophy } from "lucide-react";

interface SimulationStep {
  id: string;
  title: string;
  context: string;
  question: string;
  options: {
    id: string;
    text: string;
    analysis: string;
    riskLevel: 'Low' | 'Medium' | 'High';
  }[];
}

interface VendorSimulationInterfaceProps {
  scenarioId: string;
  onBack: () => void;
}

const VendorSimulationInterface = ({ scenarioId, onBack }: VendorSimulationInterfaceProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [userChoices, setUserChoices] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const scenarios = {
    "new-agency-partnership": {
      title: "New Agency Partnership",
      briefing: "You are the Revenue Manager at Phuket Beach Resort & Spa. Desert Dreams Travel, a new agency claiming to book 100+ room nights annually, has submitted their first rate request.",
      details: {
        rate: "$125/night (19% below your $155 standard rate)",
        dates: "March 20-25, 2025 (5 nights)",
        rooms: "3 rooms (6 guests)",
        specialNeeds: "Halal dining, airport transfers"
      },
      situation: {
        occupancy: "72% for those dates",
        competitorRates: "$130-150/night for similar properties",
        costs: "$85/night (breakeven)",
        agencyClaims: "100+ room nights/year potential"
      },
      steps: [
        {
          id: "initial-response",
          title: "DECISION POINT 1",
          context: "The agency has submitted their initial request. What's your response strategy?",
          question: "What's your initial response strategy?",
          options: [
            {
              id: "accept-125",
              text: "Accept their rate to build relationship ($125/night)",
              analysis: "Low margin but good relationship starter",
              riskLevel: "Medium" as const
            },
            {
              id: "counter-145",
              text: "Counter with modest discount ($145/night)",
              analysis: "Balanced approach, tests their commitment",
              riskLevel: "Low" as const
            },
            {
              id: "counter-150",
              text: "Counter close to market rate ($150/night)",
              analysis: "Protects margins but may lose new partnership",
              riskLevel: "High" as const
            },
            {
              id: "request-proof",
              text: "Request proof of volume before negotiating",
              analysis: "Professional approach, gathers intel",
              riskLevel: "Low" as const
            }
          ]
        },
        {
          id: "counter-response",
          title: "DECISION POINT 2",
          context: "AGENCY RESPONSE: 'We understand your position. We're willing to meet you at $135/night as we really want to establish a partnership. We can also provide references from our other resort partners in Thailand who can vouch for our volume.'",
          question: "How do you respond to their counter-offer?",
          options: [
            {
              id: "accept-135",
              text: "Accept $135/night and build the relationship",
              analysis: "Good compromise, reasonable margin",
              riskLevel: "Low" as const
            },
            {
              id: "counter-140",
              text: "Counter at $140/night with value-adds",
              analysis: "Tests their flexibility while adding value",
              riskLevel: "Medium" as const
            },
            {
              id: "request-references",
              text: "Request references before finalizing",
              analysis: "Due diligence approach",
              riskLevel: "Low" as const
            },
            {
              id: "decline-partnership",
              text: "Decline - rate too low for new partnership",
              analysis: "Protects margins but loses opportunity",
              riskLevel: "High" as const
            }
          ]
        }
      ]
    }
  };

  const currentScenario = scenarios[scenarioId as keyof typeof scenarios];
  const currentStepData = currentScenario?.steps[currentStep];

  const handleNext = () => {
    if (selectedOption) {
      setUserChoices([...userChoices, selectedOption]);
      
      if (currentStep < currentScenario.steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedOption("");
      } else {
        setShowResult(true);
      }
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (showResult) {
    return <SimulationResults scenarioId={scenarioId} choices={userChoices} onBack={onBack} />;
  }

  if (!currentScenario) {
    return <div>Scenario not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Training Center
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Simulation: {currentScenario.title}
              </h1>
              <p className="text-gray-600">Step {currentStep + 1} of {currentScenario.steps.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Scenario Briefing */}
          {currentStep === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Scenario Briefing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{currentScenario.briefing}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Their Request:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Rate: {currentScenario.details.rate}</li>
                      <li>• Dates: {currentScenario.details.dates}</li>
                      <li>• Rooms: {currentScenario.details.rooms}</li>
                      <li>• Special Needs: {currentScenario.details.specialNeeds}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Your Situation:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Current Occupancy: {currentScenario.situation.occupancy}</li>
                      <li>• Competitor Rates: {currentScenario.situation.competitorRates}</li>
                      <li>• Your Costs: {currentScenario.situation.costs}</li>
                      <li>• Agency Claims: {currentScenario.situation.agencyClaims}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Decision Point */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-xl text-gray-800">{currentStepData.title}</CardTitle>
              </div>
              {currentStepData.context && (
                <p className="text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  {currentStepData.context}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg text-gray-800 mb-4">{currentStepData.question}</h3>
              
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                <div className="space-y-4">
                  {currentStepData.options.map((option) => (
                    <div key={option.id} className={`p-4 rounded-lg border transition-colors ${selectedOption === option.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={option.id} className="font-medium text-gray-900 cursor-pointer">
                            {option.text}
                          </Label>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-600">{option.analysis}</span>
                            <Badge className={`text-xs ${getRiskLevelColor(option.riskLevel)}`}>
                              Risk: {option.riskLevel} 📊
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <Button 
                onClick={handleNext}
                disabled={!selectedOption}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                {currentStep < currentScenario.steps.length - 1 ? 'Continue Simulation' : 'View Results'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SimulationResults = ({ scenarioId, choices, onBack }: { scenarioId: string; choices: string[]; onBack: () => void }) => {
  // Simple scoring logic based on choices
  const calculateScore = () => {
    let score = 70; // Base score
    
    // Adjust based on choices (simplified logic)
    if (choices.includes('request-proof') || choices.includes('request-references')) score += 10;
    if (choices.includes('counter-145') || choices.includes('accept-135')) score += 12;
    if (choices.includes('accept-125')) score -= 5;
    
    return Math.min(100, score);
  };

  const score = calculateScore();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Training Center
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Simulation Results</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Results Summary */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-gray-800">Negotiation Results</CardTitle>
                <div className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-800">{score}/100</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Final Rate Achieved:</span>
                    <span className="font-semibold">$135/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Margin:</span>
                    <span className="font-semibold text-green-600">$50/night (59% markup)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Relationship Score:</span>
                    <span className="font-semibold">8.5/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue Potential:</span>
                    <span className="font-semibold text-blue-600">High (if volume claims true)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 mb-2">Performance Analysis:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-700">Excellent relationship building approach</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-700">Good balance of profitability and partnership</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-yellow-700">Could have tested volume claims more thoroughly</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Insights */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Learning Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Expert Tips:</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• For new partnerships, consider trial periods with performance bonuses</li>
                    <li>• Always document volume commitments in writing</li>
                    <li>• Cultural accommodations can justify 10-15% premium rates</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 Key Learnings:</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• New agencies often overstate volume - requesting references was smart</li>
                    <li>• Including breakfast or transfers could have justified the rate better</li>
                    <li>• This scenario typically converts to 60+ room nights annually if handled well</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Button 
                  onClick={onBack}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                >
                  Try Another Scenario
                </Button>
                <Button variant="outline" className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50">
                  Save Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorSimulationInterface;
