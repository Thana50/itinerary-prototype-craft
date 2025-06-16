
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Briefcase,
  CheckCircle,
  DollarSign,
  Percent,
  Clock,
  MessageSquare,
  Brain,
  TrendingUp,
  Copy,
  Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { aiNegotiationService, type NegotiationContext } from "@/services/aiNegotiationService";

const RateNegotiationAI = () => {
  const navigate = useNavigate();
  const [copiedStrategy, setCopiedStrategy] = useState<number | null>(null);

  const activeNegotiations = [
    {
      id: 1,
      provider: "Phuket Beach Resort & Spa",
      service: "Superior Ocean View Room",
      serviceType: "hotel" as const,
      originalRate: 180,
      targetRate: 150,
      currentOffer: 165,
      status: "Negotiating",
      statusColor: "bg-yellow-500",
      lastUpdate: "2 hours ago",
      groupSize: 4,
      duration: 7
    },
    {
      id: 2,
      provider: "Phi Phi Island Tours",
      service: "Private Speedboat Tour (4 people)",
      serviceType: "tour" as const,
      originalRate: 320,
      targetRate: 280,
      currentOffer: 0, // Pending response
      status: "Sent",
      statusColor: "bg-blue-500",
      lastUpdate: "4 hours ago",
      groupSize: 4,
      duration: 1
    },
    {
      id: 3,
      provider: "Bangkok Airport Transfers",
      service: "Private Van Transfer",
      serviceType: "transfer" as const,
      originalRate: 45,
      targetRate: 35,
      currentOffer: 40,
      status: "Counter Received",
      statusColor: "bg-orange-500",
      lastUpdate: "30 minutes ago",
      groupSize: 4,
      duration: 1
    }
  ];

  const generateAIAnalysis = (negotiation: typeof activeNegotiations[0]) => {
    const context: NegotiationContext = {
      serviceType: negotiation.serviceType,
      originalRate: negotiation.originalRate,
      targetRate: negotiation.targetRate,
      currentOffer: negotiation.currentOffer,
      provider: negotiation.provider,
      service: negotiation.service,
      groupSize: negotiation.groupSize,
      duration: negotiation.duration
    };

    if (negotiation.currentOffer === 0) {
      const strategy = aiNegotiationService.generateStrategy(context);
      return {
        type: 'strategy',
        content: strategy.approach,
        details: strategy.leveragePoints[0]
      };
    } else {
      const analysis = aiNegotiationService.analyzeOffer(context);
      return {
        type: 'analysis',
        content: analysis.reasoning,
        details: analysis.marketIntelligence,
        recommendation: analysis.recommendation,
        nextSteps: analysis.nextSteps
      };
    }
  };

  const copyNegotiationStrategy = async (negotiationId: number) => {
    const negotiation = activeNegotiations.find(n => n.id === negotiationId);
    if (!negotiation) return;

    const context: NegotiationContext = {
      serviceType: negotiation.serviceType,
      originalRate: negotiation.originalRate,
      targetRate: negotiation.targetRate,
      currentOffer: negotiation.currentOffer,
      provider: negotiation.provider,
      service: negotiation.service,
      groupSize: negotiation.groupSize,
      duration: negotiation.duration
    };

    const strategy = aiNegotiationService.generateStrategy(context);
    const message = aiNegotiationService.generateNegotiationMessage(strategy, context);

    try {
      await navigator.clipboard.writeText(message);
      setCopiedStrategy(negotiationId);
      setTimeout(() => setCopiedStrategy(null), 2000);
    } catch (err) {
      console.error('Failed to copy strategy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/agent-dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rate Negotiation AI - Where Custom Trips Click.</h1>
              <p className="text-gray-600 mt-1">Automated negotiations with 85% time savings • Powered by SE Asian market intelligence</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              <Brain className="h-4 w-4 mr-1" />
              AI Enhanced
            </div>
            <span className="text-gray-600">Welcome, Agent!</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Negotiations</p>
                  <p className="text-3xl font-bold text-purple-600">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed This Week</p>
                  <p className="text-3xl font-bold text-green-600">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Savings</p>
                  <p className="text-3xl font-bold text-blue-600">$1,847</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                  <Percent className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Success Rate</p>
                  <p className="text-3xl font-bold text-indigo-600">89%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Negotiations</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="providers">Provider Network</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="space-y-6">
              {activeNegotiations.map((negotiation) => {
                const aiAnalysis = generateAIAnalysis(negotiation);
                return (
                  <Card key={negotiation.id} className="bg-white">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-purple-900">
                            {negotiation.provider}
                          </CardTitle>
                          <CardDescription className="text-gray-600 mt-1">
                            {negotiation.service}
                          </CardDescription>
                        </div>
                        <Badge className={`${negotiation.statusColor} text-white`}>
                          {negotiation.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Original Rate</p>
                          <p className="font-semibold text-gray-900">${negotiation.originalRate}{negotiation.serviceType === 'hotel' ? '/night' : negotiation.serviceType === 'tour' ? ' total' : ''}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Target Rate</p>
                          <p className="font-semibold text-green-600">${negotiation.targetRate}{negotiation.serviceType === 'hotel' ? '/night' : negotiation.serviceType === 'tour' ? ' total' : ''}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Current Offer</p>
                          <p className="font-semibold text-blue-600">
                            {negotiation.currentOffer === 0 ? "Pending Response" : `$${negotiation.currentOffer}${negotiation.serviceType === 'hotel' ? '/night' : negotiation.serviceType === 'tour' ? ' total' : ''}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start flex-1">
                            <Brain className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-purple-900 text-sm">
                                AI {aiAnalysis.type === 'strategy' ? 'Strategy' : 'Analysis'}
                              </p>
                              <p className="text-purple-700 text-sm mt-1">{aiAnalysis.content}</p>
                              <p className="text-purple-600 text-xs mt-2 italic">{aiAnalysis.details}</p>
                              {aiAnalysis.type === 'analysis' && aiAnalysis.nextSteps && (
                                <div className="mt-2">
                                  <p className="text-purple-800 text-xs font-medium">Recommended Actions:</p>
                                  <ul className="text-purple-600 text-xs mt-1 list-disc list-inside">
                                    {aiAnalysis.nextSteps.slice(0, 2).map((step, idx) => (
                                      <li key={idx}>{step}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyNegotiationStrategy(negotiation.id)}
                            className="ml-2 h-8 w-8 p-0"
                          >
                            {copiedStrategy === negotiation.id ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-purple-600" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          Last updated {negotiation.lastUpdate}
                        </div>
                        <div className="flex gap-2">
                          {negotiation.currentOffer === 0 ? (
                            <>
                              <Button size="sm" variant="outline">Follow Up</Button>
                              <Button size="sm" variant="outline">Modify Request</Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                {aiAnalysis.recommendation === 'accept' ? 'Accept Offer' : 
                                 aiAnalysis.recommendation === 'counter' ? 'Smart Counter' : 'Reject & Counter'}
                              </Button>
                              <Button size="sm" variant="outline">Manual Override</Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mr-2" />
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Negotiations</h3>
                <p className="text-gray-600 mb-4">View your successfully completed negotiations and AI-driven savings achieved.</p>
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">$1,847</p>
                    <p className="text-sm text-green-700">Total Saved</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-blue-700">This Week</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">89%</p>
                    <p className="text-sm text-purple-700">Success Rate</p>
                  </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  View Completed Negotiations
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="mt-6">
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Briefcase className="h-12 w-12 text-blue-500 mr-2" />
                  <Brain className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Enhanced Provider Network</h3>
                <p className="text-gray-600 mb-4">Manage your network of Southeast Asian service providers with AI-powered negotiation preferences and cultural insights.</p>
                <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Cultural Intelligence</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Middle Eastern client preferences</li>
                      <li>• Halal dining requirements</li>
                      <li>• Prayer time accommodations</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Market Intelligence</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Seasonal pricing patterns</li>
                      <li>• Group booking leverage</li>
                      <li>• Competitor rate analysis</li>
                    </ul>
                  </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Manage AI Provider Network
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RateNegotiationAI;
