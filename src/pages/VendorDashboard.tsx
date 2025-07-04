
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, Calendar, MessageSquare, Eye, CheckCircle, AlertCircle, TrendingUp, Trophy, Timer, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import VendorDashboardHeader from "@/components/vendor-dashboard/VendorDashboardHeader";
import VendorStatsCards from "@/components/vendor-dashboard/VendorStatsCards";
import VendorNegotiationInterface from "@/components/vendor-dashboard/VendorNegotiationInterface";
import VendorSimulationCenter from "@/components/vendor-dashboard/VendorSimulationCenter";
import VendorSimulationInterface from "@/components/vendor-dashboard/VendorSimulationInterface";
import VendorAnalyticsDashboard from "@/components/vendor-dashboard/VendorAnalyticsDashboard";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("active");
  const [selectedNegotiation, setSelectedNegotiation] = useState<string | null>(null);
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);

  const activeNegotiations = [
    {
      id: "TRV-2025-001",
      agency: "Travia Travel",
      partnerLevel: "Gold Partner",
      service: "Superior Ocean View Room",
      dates: "March 15-22, 2025 (7 nights)",
      guests: "4 guests (2 rooms)",
      requestedRate: 150,
      marketRate: 180,
      discountRequested: "17%",
      specialRequirements: "Halal dining, prayer facilities",
      status: "Awaiting Response",
      statusColor: "red",
      urgent: true,
      expiresIn: "6 hours",
      clientType: "Middle Eastern Family",
      previousBookings: 0,
      volumeOpportunity: null
    },
    {
      id: "DRT-2025-002",
      agency: "Desert Rose Travel",
      partnerLevel: "Silver Partner",
      service: "Deluxe Pool View Room",
      dates: "April 5-10, 2025 (5 nights)",
      guests: "8 guests (4 rooms)",
      requestedRate: 140,
      marketRate: 165,
      discountRequested: "15%",
      specialRequirements: "Group booking",
      status: "New Request",
      statusColor: "blue",
      urgent: false,
      expiresIn: "48 hours",
      clientType: "Corporate Group",
      previousBookings: 0,
      volumeOpportunity: "Agency books 30+ nights/month"
    },
    {
      id: "TRV-2025-003",
      agency: "Travia Travel",
      partnerLevel: "Gold Partner",
      service: "Family Suite",
      dates: "March 25-28, 2025 (3 nights)",
      guests: "5 guests (1 suite)",
      requestedRate: 220,
      marketRate: 250,
      discountRequested: "12%",
      specialRequirements: "Family with children",
      status: "Under Review",
      statusColor: "yellow",
      urgent: false,
      expiresIn: "24 hours",
      clientType: "Repeat Client",
      previousBookings: 5,
      volumeOpportunity: null
    }
  ];

  const completedNegotiations = [
    {
      id: "TRV-2025-004",
      agency: "Wanderlust Adventures",
      service: "Premium Suite",
      finalRate: 200,
      originalRate: 240,
      savings: 40,
      status: "Accepted",
      completedDate: "March 8, 2025"
    }
  ];

  const getStatusBadge = (status: string, statusColor: string, urgent?: boolean) => {
    const colorMap = {
      red: "bg-red-500 hover:bg-red-600",
      blue: "bg-blue-500 hover:bg-blue-600",
      yellow: "bg-yellow-500 hover:bg-yellow-600",
      green: "bg-green-500 hover:bg-green-600"
    };

    return (
      <div className="flex items-center gap-2">
        <Badge className={`${colorMap[statusColor as keyof typeof colorMap]} text-white`}>
          {status}
        </Badge>
        {urgent && <AlertCircle className="h-4 w-4 text-red-500" />}
      </div>
    );
  };

  const handleRespondNow = (negotiationId: string) => {
    setSelectedNegotiation(negotiationId);
  };

  const handleStartSimulation = (scenarioId: string) => {
    setSelectedSimulation(scenarioId);
  };

  if (selectedSimulation) {
    return (
      <VendorSimulationInterface 
        scenarioId={selectedSimulation}
        onBack={() => setSelectedSimulation(null)}
      />
    );
  }

  if (selectedNegotiation) {
    const negotiation = activeNegotiations.find(n => n.id === selectedNegotiation);
    return (
      <VendorNegotiationInterface 
        negotiation={negotiation!}
        onBack={() => setSelectedNegotiation(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <VendorDashboardHeader />

      <div className="container mx-auto px-4 py-8">
        <VendorStatsCards />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Vendor Management Center</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage negotiations and practice your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="active" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      Active Requests (3)
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                      Completed (12)
                    </TabsTrigger>
                    <TabsTrigger value="practice" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                      Practice Negotiations
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                      Performance Analytics
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="space-y-4">
                    {activeNegotiations.map((negotiation) => (
                      <div key={negotiation.id} className={`border rounded-lg p-6 ${negotiation.urgent ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' : 'bg-gradient-to-r from-white to-blue-50'} hover:shadow-md transition-shadow`}>
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {negotiation.urgent && (
                                <Badge className="bg-red-600 text-white font-semibold">
                                  URGENT - Expires in {negotiation.expiresIn}
                                </Badge>
                              )}
                              <h3 className="font-semibold text-lg text-gray-800">{negotiation.service}</h3>
                              {getStatusBadge(negotiation.status, negotiation.statusColor, negotiation.urgent)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-1 text-sm">
                                <p><span className="text-gray-500">Agency:</span> <span className="font-medium">{negotiation.agency}</span> <Badge variant="outline" className="ml-1">{negotiation.partnerLevel}</Badge></p>
                                <p><span className="text-gray-500">Client:</span> {negotiation.clientType}</p>
                                <p><span className="text-gray-500">Dates:</span> {negotiation.dates}</p>
                                <p><span className="text-gray-500">Guests:</span> {negotiation.guests}</p>
                              </div>
                              <div className="space-y-1 text-sm">
                                <p><span className="text-gray-500">Market Rate:</span> <span className="font-semibold">${negotiation.marketRate}/night</span></p>
                                <p><span className="text-gray-500">Requested:</span> <span className="font-semibold text-orange-600">${negotiation.requestedRate}/night</span></p>
                                <p><span className="text-gray-500">Discount:</span> <span className="text-red-600 font-medium">{negotiation.discountRequested}</span></p>
                                <p><span className="text-gray-500">Requirements:</span> {negotiation.specialRequirements}</p>
                              </div>
                            </div>
                            {negotiation.volumeOpportunity && (
                              <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-800"><strong>Volume Opportunity:</strong> {negotiation.volumeOpportunity}</p>
                              </div>
                            )}
                            {negotiation.previousBookings > 0 && (
                              <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-green-800"><strong>Repeat Client:</strong> {negotiation.previousBookings} successful bookings with this client</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <Button 
                            onClick={() => handleRespondNow(negotiation.id)}
                            className={negotiation.urgent ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {negotiation.urgent ? "Respond Now" : "Review Details"}
                          </Button>
                          {negotiation.urgent && (
                            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                              <Clock className="h-4 w-4 mr-2" />
                              Request Extension
                            </Button>
                          )}
                          <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message Agency
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4">
                    {completedNegotiations.map((negotiation) => (
                      <div key={negotiation.id} className="border rounded-lg p-6 bg-gradient-to-r from-white to-green-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-gray-800">{negotiation.service}</h3>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <Badge className="bg-green-500 hover:bg-green-600 text-white">Accepted</Badge>
                            </div>
                            <p className="text-gray-600">
                              {negotiation.agency} | Completed: {negotiation.completedDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">${negotiation.finalRate}/night</p>
                            <p className="text-sm text-gray-600">
                              Discount: ${negotiation.savings}/night
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="practice">
                    <VendorSimulationCenter onStartSimulation={handleStartSimulation} />
                  </TabsContent>

                  <TabsContent value="analytics">
                    <VendorAnalyticsDashboard />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                  View All Negotiations
                </Button>
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                  Update Rate Calendar
                </Button>
                <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50">
                  Performance Analytics
                </Button>
                <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                  Partner Support
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold text-green-600">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Response Time</span>
                    <span className="font-semibold text-blue-600">4.2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-purple-600">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Partner Score</span>
                    <span className="font-semibold text-orange-600">92/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
