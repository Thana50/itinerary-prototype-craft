
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Percent, CheckCircle, Clock, Filter } from "lucide-react";

const CompletedNegotiationsTab = () => {
  const [activeFilters, setActiveFilters] = useState({
    timePeriod: "Last month",
    providerType: "All",
    status: "All",
    savingsRange: "All"
  });

  const completedNegotiations = [
    {
      id: 1,
      provider: "Chiang Mai Elephant Sanctuary",
      service: "Half-day elephant experience (4 people)",
      originalRate: 200,
      finalRate: 160,
      savings: 40,
      savingsPercent: 20,
      status: "Accepted",
      statusColor: "bg-green-500",
      negotiationDuration: "2 days",
      completed: "3 days ago",
      type: "Activities"
    },
    {
      id: 2,
      provider: "Singapore Marina Bay Hotel",
      service: "Deluxe City View Room",
      originalRate: 280,
      finalRate: 245,
      savings: 35,
      savingsPercent: 12.5,
      status: "Accepted",
      statusColor: "bg-green-500",
      negotiationDuration: "1 day",
      completed: "1 week ago",
      type: "Hotels"
    },
    {
      id: 3,
      provider: "Kuala Lumpur Food Tours",
      service: "Halal food tour (4 people)",
      originalRate: 180,
      finalRate: 150,
      savings: 30,
      savingsPercent: 16.7,
      status: "Accepted",
      statusColor: "bg-green-500",
      negotiationDuration: "3 hours",
      completed: "2 weeks ago",
      type: "Tours"
    },
    {
      id: 4,
      provider: "Bali Luxury Resort",
      service: "Ocean Villa Suite",
      originalRate: 450,
      targetRate: 350,
      finalRate: null,
      savings: 0,
      savingsPercent: 0,
      status: "No Agreement",
      statusColor: "bg-red-500",
      negotiationDuration: "5 days",
      completed: "1 week ago",
      reason: "Provider inflexible on peak season rates",
      type: "Hotels"
    },
    {
      id: 5,
      provider: "Vietnam Adventure Tours",
      service: "Multi-day Halong Bay cruise",
      originalRate: 600,
      targetRate: 500,
      finalRate: null,
      savings: 0,
      savingsPercent: 0,
      status: "No Agreement",
      statusColor: "bg-red-500",
      negotiationDuration: "3 days",
      completed: "2 weeks ago",
      reason: "Minimum group size requirements not met",
      type: "Tours"
    }
  ];

  return (
    <div className="mt-6">
      {/* Performance Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-lg inline-flex mb-2">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">$2,347</p>
              <p className="text-sm text-gray-500">Saved This Month</p>
              <p className="text-xs text-gray-400">18 negotiations</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-lg inline-flex mb-2">
                <Percent className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">14.2%</p>
              <p className="text-sm text-gray-500">Average Savings</p>
              <p className="text-xs text-gray-400">per successful deal</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-lg inline-flex mb-2">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">76%</p>
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-xs text-gray-400">13 of 17 total</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="p-3 bg-indigo-100 rounded-lg inline-flex mb-2">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-indigo-600">1.3</p>
              <p className="text-sm text-gray-500">Avg Duration</p>
              <p className="text-xs text-gray-400">days per negotiation</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <div className="flex gap-4">
              <select 
                className="text-sm border border-gray-300 rounded px-3 py-1"
                value={activeFilters.timePeriod}
                onChange={(e) => setActiveFilters({...activeFilters, timePeriod: e.target.value})}
              >
                <option>Last 7 days</option>
                <option>Last month</option>
                <option>Last quarter</option>
              </select>
              <select 
                className="text-sm border border-gray-300 rounded px-3 py-1"
                value={activeFilters.providerType}
                onChange={(e) => setActiveFilters({...activeFilters, providerType: e.target.value})}
              >
                <option>All</option>
                <option>Hotels</option>
                <option>Tours</option>
                <option>Transfers</option>
                <option>Activities</option>
              </select>
              <select 
                className="text-sm border border-gray-300 rounded px-3 py-1"
                value={activeFilters.status}
                onChange={(e) => setActiveFilters({...activeFilters, status: e.target.value})}
              >
                <option>All</option>
                <option>Successful</option>
                <option>Failed</option>
                <option>Expired</option>
              </select>
              <select 
                className="text-sm border border-gray-300 rounded px-3 py-1"
                value={activeFilters.savingsRange}
                onChange={(e) => setActiveFilters({...activeFilters, savingsRange: e.target.value})}
              >
                <option>All</option>
                <option>0-10%</option>
                <option>10-20%</option>
                <option>20%+</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed Negotiations Table */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Completed Negotiations</CardTitle>
          <CardDescription>Track your successful deals and learn from outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider & Service</TableHead>
                <TableHead>Original Rate</TableHead>
                <TableHead>Final Rate</TableHead>
                <TableHead>Savings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedNegotiations.map((negotiation) => (
                <TableRow key={negotiation.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{negotiation.provider}</p>
                      <p className="text-sm text-gray-500">{negotiation.service}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${negotiation.originalRate}</TableCell>
                  <TableCell className="font-medium">
                    {negotiation.finalRate ? `$${negotiation.finalRate}` : "N/A"}
                  </TableCell>
                  <TableCell>
                    {negotiation.savings > 0 ? (
                      <div className="text-green-600">
                        <p className="font-medium">${negotiation.savings}</p>
                        <p className="text-xs">({negotiation.savingsPercent}%)</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${negotiation.statusColor} text-white`}>
                      {negotiation.status}
                    </Badge>
                    {negotiation.reason && (
                      <p className="text-xs text-gray-500 mt-1">{negotiation.reason}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{negotiation.negotiationDuration}</TableCell>
                  <TableCell className="text-sm text-gray-500">{negotiation.completed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletedNegotiationsTab;
