
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, Star, Brain, User } from "lucide-react";

const PerformanceAnalytics = () => {
  const aiMetrics = [
    { label: "Success Rate", value: "87%", detail: "234/268 negotiations", icon: TrendingUp, color: "text-green-600" },
    { label: "Average Discount", value: "12.3%", detail: "vs market rates", icon: Star, color: "text-blue-600" },
    { label: "Average Time", value: "18.7 hours", detail: "to completion", icon: Clock, color: "text-purple-600" },
    { label: "Client Satisfaction", value: "91%", detail: "post-booking survey", icon: Users, color: "text-orange-600" }
  ];

  const overrideMetrics = [
    { label: "Override Frequency", value: "23%", detail: "agent overrides AI in 23% of cases" },
    { label: "Override Success Rate", value: "89%", detail: "when agent takes control" },
    { label: "Average Discount with Overrides", value: "14.1%", detail: "vs 12.3% AI-only" },
    { label: "Outperformed AI", value: "67%", detail: "cases where override was better" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-purple-600 mr-2" />
              <CardTitle>AI Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IconComponent className={`h-4 w-4 ${metric.color} mr-2`} />
                      <div>
                        <p className="text-sm font-medium">{metric.label}</p>
                        <p className="text-xs text-gray-600">{metric.detail}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <CardTitle>Human Override Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overrideMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{metric.label}</p>
                    <p className="text-xs text-gray-600">{metric.detail}</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">🚀 AI Improvement Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-green-800 font-medium">Increase counter-offer aggressiveness for hotel negotiations by 2%</p>
                <p className="text-xs text-green-700">Based on 15 recent successful aggressive counters</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-green-800 font-medium">Better recognition of repeat provider relationships</p>
                <p className="text-xs text-green-700">Agents override 34% more often with known providers</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-green-800 font-medium">Improve timing optimization for provider responses</p>
                <p className="text-xs text-green-700">Tuesday 9-11 AM messages have 23% higher success rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600">89%</div>
            <p className="text-sm text-gray-600 mt-1">AI + Human Combined Success Rate</p>
            <Badge className="mt-2 bg-blue-100 text-blue-800">Optimal Performance</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600">$47K</div>
            <p className="text-sm text-gray-600 mt-1">Total Savings This Month</p>
            <Badge className="mt-2 bg-purple-100 text-purple-800">+18% vs Last Month</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600">4.7</div>
            <p className="text-sm text-gray-600 mt-1">Average Client Rating</p>
            <Badge className="mt-2 bg-green-100 text-green-800">Excellent</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
