
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MapPin, Users, Calendar, CheckCircle } from "lucide-react";

const MarketIntelligence = () => {
  const marketData = [
    { location: "Phuket Hotels", period: "March 2025", range: "$140-190/night", trend: "stable" },
    { location: "Phi Phi Island Tours", period: "March 2025", range: "$60-80/person", trend: "up" },
    { location: "Bangkok Transfers", period: "March 2025", range: "$35-45/trip", trend: "down" }
  ];

  const confidenceLevels = [
    { metric: "Market Data Confidence", level: 92, icon: TrendingUp },
    { metric: "Provider Pattern Recognition", level: 87, icon: Users },
    { metric: "Seasonal Pricing Knowledge", level: 95, icon: Calendar },
    { metric: "Cultural Requirements Understanding", level: 89, icon: MapPin }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-600 mr-2" />
            Current Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{data.location}</h4>
                  <p className="text-sm text-gray-600">{data.period}: {data.range} average</p>
                </div>
                <Badge variant={data.trend === "up" ? "destructive" : data.trend === "down" ? "default" : "secondary"}>
                  {data.trend === "up" ? "↗️ Rising" : data.trend === "down" ? "↘️ Falling" : "→ Stable"}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900">Group Discount Intelligence</h4>
              <p className="text-sm text-blue-700 mt-1">Range: 10-25% below standard rates</p>
              <p className="text-xs text-blue-600 mt-1">Based on 1,247 recent group bookings</p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900">Occupancy Forecast</h4>
              <p className="text-sm text-purple-700 mt-1">78% (shoulder season pricing applies)</p>
              <p className="text-xs text-purple-600 mt-1">Updated 2 hours ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            AI Confidence Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {confidenceLevels.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconComponent className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium">{item.metric}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full ${item.level >= 90 ? 'bg-green-500' : item.level >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${item.level}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.level}%</span>
                    {item.level >= 85 && <CheckCircle className="h-4 w-4 text-green-500 ml-1" />}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Market Intelligence Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-yellow-800 font-medium">Phuket hotel rates trending 5% lower this week</p>
                <p className="text-xs text-yellow-700">Opportunity for more aggressive negotiations</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-yellow-800 font-medium">New competitor pricing data imported</p>
                <p className="text-xs text-yellow-700">47 properties updated in last 6 hours</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-yellow-800 font-medium">Cultural requirements database enhanced</p>
                <p className="text-xs text-yellow-700">Added 23 new halal-certified properties</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketIntelligence;
