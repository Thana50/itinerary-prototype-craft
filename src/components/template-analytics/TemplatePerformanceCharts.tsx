
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface TemplatePerformanceChartsProps {
  timeRange: string;
}

const TemplatePerformanceCharts: React.FC<TemplatePerformanceChartsProps> = ({ timeRange }) => {
  const performanceData = [
    { name: "Phuket Beach Paradise", successRate: 94, usage: 45, satisfaction: 4.8 },
    { name: "Singapore Family Adventure", successRate: 91, usage: 38, satisfaction: 4.6 },
    { name: "Bali Cultural Immersion", successRate: 89, usage: 32, satisfaction: 4.7 },
    { name: "Tokyo Modern Explorer", successRate: 87, usage: 28, satisfaction: 4.5 },
    { name: "Dubai Luxury Experience", successRate: 93, usage: 25, satisfaction: 4.9 }
  ];

  const timeSavingsData = [
    { name: "Phuket Beach", timeSaved: 8.5, usage: 45 },
    { name: "Singapore Family", timeSaved: 7.2, usage: 38 },
    { name: "Bali Cultural", timeSaved: 6.8, usage: 32 },
    { name: "Tokyo Modern", timeSaved: 9.1, usage: 28 },
    { name: "Dubai Luxury", timeSaved: 10.3, usage: 25 }
  ];

  const monthlyTrends = [
    { month: "Jan", templates: 12, success: 88 },
    { month: "Feb", templates: 18, success: 90 },
    { month: "Mar", templates: 25, success: 91 },
    { month: "Apr", templates: 32, success: 93 },
    { month: "May", templates: 41, success: 92 },
    { month: "Jun", templates: 47, success: 92 }
  ];

  const categoryData = [
    { name: "Beach & Resort", value: 35, color: "#3B82F6" },
    { name: "Cultural", value: 28, color: "#10B981" },
    { name: "Family", value: 22, color: "#F59E0B" },
    { name: "Luxury", value: 15, color: "#8B5CF6" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Template Success Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Template Success Rates</CardTitle>
          <CardDescription>Success rate vs usage frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="successRate" fill="#3B82F6" name="Success Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Time Savings per Template */}
      <Card>
        <CardHeader>
          <CardTitle>Time Savings per Template</CardTitle>
          <CardDescription>Average hours saved per template usage</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSavingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="timeSaved" fill="#10B981" name="Hours Saved" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Growth Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Template Growth & Performance</CardTitle>
          <CardDescription>Monthly template usage and success trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="templates" stroke="#3B82F6" name="Templates Used" strokeWidth={2} />
              <Line type="monotone" dataKey="success" stroke="#10B981" name="Success Rate %" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Template Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Template Categories</CardTitle>
          <CardDescription>Distribution by template type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplatePerformanceCharts;
