
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, Calendar, MessageSquare, Eye, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("active");

  const activeNegotiations = [
    {
      id: "TRV-2025-001",
      agency: "Travia Travel",
      service: "Superior Ocean View Room",
      dates: "March 15-22, 2025 (7 nights)",
      guests: "4 guests (2 rooms)",
      requestedRate: 150,
      currentRate: 180,
      status: "pending",
      priority: "high",
      hoursLeft: 36,
      clientType: "Group Booking - UAE Family",
      specialRequests: "Halal dining, prayer facilities"
    },
    {
      id: "TRV-2025-002", 
      agency: "Paradise Travels",
      service: "Deluxe Garden View",
      dates: "April 2-5, 2025 (3 nights)",
      guests: "2 guests (1 room)",
      requestedRate: 120,
      currentRate: 140,
      status: "countered",
      priority: "medium",
      hoursLeft: 72,
      clientType: "Honeymoon Couple",
      specialRequests: "Room decoration"
    }
  ];

  const completedNegotiations = [
    {
      id: "TRV-2025-003",
      agency: "Wanderlust Adventures", 
      service: "Premium Suite",
      finalRate: 200,
      originalRate: 240,
      savings: 40,
      status: "accepted",
      completedDate: "March 8, 2025"
    }
  ];

  const getStatusBadge = (status: string, priority?: string) => {
    switch (status) {
      case "pending":
        return <Badge className={`${priority === 'high' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}>
          Awaiting Response
        </Badge>;
      case "countered":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Counter Sent</Badge>;
      case "accepted":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Accepted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewNegotiation = (id: string) => {
    navigate(`/provider-portal/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Vendor Dashboard
              </h1>
              <p className="text-lg text-gray-600 mt-2">Manage service requests and pricing negotiations</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Phuket Beach Resort & Spa</p>
              <p className="font-medium text-gray-800">vendor@demo.com</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Negotiations</p>
                  <p className="text-3xl font-bold">4</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Pending Responses</p>
                  <p className="text-3xl font-bold">2</p>
                </div>
                <Clock className="h-8 w-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Confirmed Bookings</p>
                  <p className="text-3xl font-bold">7</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Revenue This Month</p>
                  <p className="text-3xl font-bold">$28K</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Pricing Negotiations</CardTitle>
                <CardDescription className="text-gray-600">
                  Review and respond to pricing requests from travel agencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="active" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      Active Negotiations
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                      Completed
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="space-y-4">
                    {activeNegotiations.map((negotiation) => (
                      <div key={negotiation.id} className="border rounded-lg p-6 bg-gradient-to-r from-white to-blue-50 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-gray-800">{negotiation.service}</h3>
                              {getStatusBadge(negotiation.status, negotiation.priority)}
                              {negotiation.priority === 'high' && (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                            <p className="text-gray-600 mb-1">
                              <strong>Agency:</strong> {negotiation.agency} | <strong>ID:</strong> {negotiation.id}
                            </p>
                            <p className="text-gray-600 mb-1">
                              <strong>Client:</strong> {negotiation.clientType}
                            </p>
                            <p className="text-gray-600">
                              <strong>Special Requests:</strong> {negotiation.specialRequests}
                            </p>
                          </div>
                          <div className="mt-4 md:mt-0 md:text-right">
                            <div className="flex items-center justify-end text-xl font-bold text-gray-800 mb-1">
                              <span className="text-red-500 line-through mr-2">${negotiation.currentRate}</span>
                              <span className="text-green-600">${negotiation.requestedRate}/night</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Response due in {negotiation.hoursLeft} hours
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm mb-4">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">{negotiation.dates} | {negotiation.guests}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <Button 
                            onClick={() => handleViewNegotiation(negotiation.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review & Respond
                          </Button>
                          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
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
                              {getStatusBadge(negotiation.status)}
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
                    <span className="font-semibold text-green-600">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Response Time</span>
                    <span className="font-semibold text-blue-600">4.2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-purple-600">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Partner Rating</span>
                    <span className="font-semibold text-orange-600">4.8/5.0</span>
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
