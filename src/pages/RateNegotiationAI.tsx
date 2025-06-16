
import React from "react";
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
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RateNegotiationAI = () => {
  const navigate = useNavigate();

  const activeNegotiations = [
    {
      id: 1,
      provider: "Phuket Beach Resort & Spa",
      service: "Superior Ocean View Room",
      originalRate: "$180/night",
      targetRate: "$150/night",
      currentOffer: "$165/night",
      status: "Negotiating",
      statusColor: "bg-yellow-500",
      aiSuggestion: "Counter with $155 based on 7-night stay and group booking",
      lastUpdate: "2 hours ago",
      actions: ["Accept Offer", "Counter Offer", "Reject"]
    },
    {
      id: 2,
      provider: "Phi Phi Island Tours",
      service: "Private Speedboat Tour (4 people)",
      originalRate: "$320 total",
      targetRate: "$280 total",
      currentOffer: "Pending Response",
      status: "Sent",
      statusColor: "bg-blue-500",
      aiSuggestion: "Initial outreach sent with group discount request",
      lastUpdate: "4 hours ago",
      actions: ["Follow Up", "Modify Request"]
    },
    {
      id: 3,
      provider: "Bangkok Airport Transfers",
      service: "Private Van Transfer",
      originalRate: "$45",
      targetRate: "$35",
      currentOffer: "$40",
      status: "Counter Received",
      statusColor: "bg-orange-500",
      aiSuggestion: "Good offer - recommend acceptance. $5 savings per transfer",
      lastUpdate: "30 minutes ago",
      actions: ["Accept Offer", "Counter Offer", "Reject"]
    }
  ];

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
              <p className="text-gray-600 mt-1">Automated negotiations with 85% time savings</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
              {activeNegotiations.map((negotiation) => (
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
                        <p className="font-semibold text-gray-900">{negotiation.originalRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Target Rate</p>
                        <p className="font-semibold text-green-600">{negotiation.targetRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Offer</p>
                        <p className="font-semibold text-blue-600">{negotiation.currentOffer}</p>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <MessageSquare className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-purple-900 text-sm">AI Suggestion</p>
                          <p className="text-purple-700 text-sm mt-1">{negotiation.aiSuggestion}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Last updated {negotiation.lastUpdate}
                      </div>
                      <div className="flex gap-2">
                        {negotiation.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant={index === 0 ? "default" : "outline"}
                            size="sm"
                            className={index === 0 ? "bg-purple-600 hover:bg-purple-700" : ""}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Negotiations</h3>
                <p className="text-gray-600">View your successfully completed negotiations and savings achieved.</p>
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                  View Completed Negotiations
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="mt-6">
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <Briefcase className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Provider Network</h3>
                <p className="text-gray-600">Manage your network of Southeast Asian service providers and their negotiation preferences.</p>
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                  Manage Providers
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
