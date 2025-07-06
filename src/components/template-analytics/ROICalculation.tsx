
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Clock, TrendingUp, Calculator } from "lucide-react";

interface ROICalculationProps {
  timeRange: string;
}

const ROICalculation: React.FC<ROICalculationProps> = ({ timeRange }) => {
  const roiMetrics = [
    { metric: "Total Time Saved", value: "1,248 hrs", cost: "$87,360", icon: Clock },
    { metric: "Template Development Cost", value: "$32,000", roi: "173%", icon: DollarSign },
    { metric: "Productivity Increase", value: "68%", efficiency: "2.3x", icon: TrendingUp },
    { metric: "Net ROI", value: "$55,360", margin: "63%", icon: Calculator }
  ];

  const monthlyROI = [
    { month: "Jan", timeSaved: 180, cost: 12600, roi: 8400 },
    { month: "Feb", timeSaved: 195, cost: 13650, roi: 9100 },
    { month: "Mar", timeSaved: 210, cost: 14700, roi: 9800 },
    { month: "Apr", timeSaved: 225, cost: 15750, roi: 10500 },
    { month: "May", timeSaved: 238, cost: 16660, roi: 11108 },
    { month: "Jun", timeSaved: 200, cost: 14000, roi: 9333 }
  ];

  const templateROI = [
    { name: "Phuket Beach", investment: 2800, returns: 8400, roi: 200 },
    { name: "Singapore Family", investment: 2400, returns: 6720, roi: 180 },
    { name: "Bali Cultural", investment: 2200, returns: 5940, roi: 170 },
    { name: "Tokyo Modern", investment: 3200, returns: 7680, roi: 140 },
    { name: "Dubai Luxury", investment: 3800, returns: 8740, roi: 130 }
  ];

  const costBreakdown = [
    { category: "Template Development", hours: 240, cost: 16800 },
    { category: "Training & Onboarding", hours: 80, cost: 5600 },
    { category: "System Integration", hours: 60, cost: 4200 },
    { category: "Maintenance & Updates", hours: 120, cost: 8400 },
    { category: "Quality Assurance", hours: 40, cost: 2800 }
  ];

  return (
    <div className="space-y-6">
      {/* ROI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roiMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                <IconComponent className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{metric.value}</div>
                <p className="text-xs text-green-600 mt-1">
                  {metric.cost || metric.roi || metric.efficiency || metric.margin}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly ROI Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly ROI Trends</CardTitle>
            <CardDescription>Time saved vs cost analysis over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyROI}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'timeSaved' ? `${value} hrs` : `$${value}`,
                  name === 'timeSaved' ? 'Time Saved' : name === 'cost' ? 'Cost' : 'ROI'
                ]} />
                <Line type="monotone" dataKey="timeSaved" stroke="#3B82F6" name="Time Saved" strokeWidth={2} />
                <Line type="monotone" dataKey="roi" stroke="#10B981" name="ROI" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Template ROI Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Template ROI Comparison</CardTitle>
            <CardDescription>Return on investment by template</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={templateROI}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `${value}%`,
                  'ROI Percentage'
                ]} />
                <Bar dataKey="roi" fill="#10B981" name="ROI %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Template Program Cost Breakdown</CardTitle>
            <CardDescription>Investment breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.category}</h4>
                    <p className="text-sm text-gray-600">{item.hours} hours invested</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-900">${item.cost.toLocaleString()}</span>
                    <p className="text-xs text-gray-500">${(item.cost/item.hours).toFixed(0)}/hr</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-green-900">Total Program ROI</h4>
                  <p className="text-sm text-green-700">Based on 6-month performance</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-900">173%</span>
                  <p className="text-sm text-green-700">$55,360 net gain</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ROICalculation;
