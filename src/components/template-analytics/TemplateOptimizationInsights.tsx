
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";

interface TemplateOptimizationInsightsProps {
  timeRange: string;
}

const TemplateOptimizationInsights: React.FC<TemplateOptimizationInsightsProps> = ({ timeRange }) => {
  const customizationData = [
    { customization: "Accommodation Upgrade", frequency: 78, impact: "High" },
    { customization: "Activity Addition", frequency: 65, impact: "Medium" },
    { customization: "Meal Preferences", frequency: 54, impact: "High" },
    { customization: "Transportation Change", frequency: 43, impact: "Medium" },
    { customization: "Duration Extension", frequency: 38, impact: "High" },
    { customization: "Budget Adjustment", frequency: 32, impact: "Low" }
  ];

  const templateIssues = [
    { template: "Phuket Beach Paradise", issues: 3, improvements: "Update seasonal activities" },
    { template: "Singapore Family", issues: 1, improvements: "Add more kid-friendly options" },
    { template: "Bali Cultural", issues: 5, improvements: "Update temple visiting hours" },
    { template: "Tokyo Modern", issues: 2, improvements: "Include transport passes" }
  ];

  const optimizationOpportunities = [
    { area: "Activity Timing", potential: 85, description: "Optimize daily schedules based on usage patterns" },
    { area: "Accommodation Options", potential: 72, description: "Add more mid-range hotel alternatives" },
    { area: "Meal Planning", potential: 68, description: "Include more dietary preference options" },
    { area: "Transport Integration", potential: 59, description: "Better integrate local transport options" }
  ];

  const customizationImpact = [
    { name: "High Impact", value: 45, color: "#EF4444" },
    { name: "Medium Impact", value: 35, color: "#F59E0B" },
    { name: "Low Impact", value: 20, color: "#10B981" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Customizations */}
        <Card>
          <CardHeader>
            <CardTitle>Most Common Customizations</CardTitle>
            <CardDescription>Frequency of template modifications</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="customization" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="frequency" fill="#3B82F6" name="Frequency" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customization Impact Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Customization Impact</CardTitle>
            <CardDescription>Distribution by business impact level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customizationImpact}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {customizationImpact.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Template Issues & Improvements */}
      <Card>
        <CardHeader>
          <CardTitle>Template Issues & Improvement Opportunities</CardTitle>
          <CardDescription>Identified issues and suggested improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templateIssues.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.template}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.improvements}</p>
                </div>
                <div className="text-right">
                  <Badge variant={item.issues > 3 ? "destructive" : item.issues > 1 ? "secondary" : "default"}>
                    {item.issues} issues
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Opportunities</CardTitle>
          <CardDescription>Areas with highest improvement potential</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationOpportunities.map((opportunity, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{opportunity.area}</h4>
                  <span className="text-sm font-medium text-blue-600">{opportunity.potential}% potential</span>
                </div>
                <p className="text-sm text-gray-600">{opportunity.description}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${opportunity.potential}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateOptimizationInsights;
