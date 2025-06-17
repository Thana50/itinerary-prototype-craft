
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Clock, TrendingUp, Users, Filter, Search } from "lucide-react";

const CommunicationDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const todayStats = {
    messagesSent: 47,
    messagesReceived: 31,
    averageNegotiationLength: 2.3,
    fastestClosure: "4 hours",
    successRates: {
      professional: 89,
      casual: 76,
      aggressive: 23
    }
  };

  const recentCommunications = [
    {
      id: 1,
      provider: "Phuket Beach Resort & Spa",
      lastMessage: "2 hours ago",
      status: "awaiting_response",
      statusColor: "bg-yellow-500",
      messageCount: 3,
      responseTime: "4.2h avg"
    },
    {
      id: 2,
      provider: "Phi Phi Island Tours",
      lastMessage: "4 hours ago",
      status: "pending_send",
      statusColor: "bg-blue-500",
      messageCount: 1,
      responseTime: "New request"
    },
    {
      id: 3,
      provider: "Bangkok Airport Transfers",
      lastMessage: "30 minutes ago",
      status: "responded",
      statusColor: "bg-green-500",
      messageCount: 5,
      responseTime: "1.5h avg"
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case "awaiting_response": return "Awaiting Response";
      case "pending_send": return "Pending Send";
      case "responded": return "Responded";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Messages Sent Today</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.messagesSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Responses Received</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.messagesReceived}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Negotiation</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.averageNegotiationLength} rounds</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Fastest Closure</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.fastestClosure}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate by Communication Style */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Success Rate by Communication Style</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{todayStats.successRates.professional}%</div>
              <div className="text-sm text-gray-600">Professional</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{todayStats.successRates.casual}%</div>
              <div className="text-sm text-gray-600">Casual</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{todayStats.successRates.aggressive}%</div>
              <div className="text-sm text-gray-600">Aggressive</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "awaiting" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("awaiting")}
          >
            Awaiting Response
          </Button>
          <Button
            variant={filterStatus === "responded" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("responded")}
          >
            Responded
          </Button>
        </div>
      </div>

      {/* Recent Communications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCommunications.map((comm) => (
              <div key={comm.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium text-gray-900">{comm.provider}</p>
                      <p className="text-sm text-gray-500">Last message: {comm.lastMessage}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{comm.messageCount} messages</p>
                    <p className="text-xs text-gray-500">{comm.responseTime}</p>
                  </div>
                  
                  <Badge className={`${comm.statusColor} text-white`}>
                    {getStatusText(comm.status)}
                  </Badge>
                  
                  <Button size="sm" variant="outline">
                    View Timeline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bulk Communication Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Send className="h-4 w-4 mr-2" />
              Send to Multiple Providers
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Template Broadcast
            </Button>
            <Button variant="outline" className="justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Follow-ups
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationDashboard;
