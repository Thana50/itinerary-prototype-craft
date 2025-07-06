
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, TrendingUp, Users } from "lucide-react";

interface AgentProductivityMetricsProps {
  timeRange: string;
}

const AgentProductivityMetrics: React.FC<AgentProductivityMetricsProps> = ({ timeRange }) => {
  const agentProductivityData = [
    { agent: "Sarah Chen", templateRatio: 85, manualRatio: 15, timeSaved: 42, efficiency: 94 },
    { agent: "Mike Johnson", templateRatio: 78, manualRatio: 22, timeSaved: 38, efficiency: 89 },
    { agent: "Emma Wilson", templateRatio: 92, manualRatio: 8, timeSaved: 48, efficiency: 96 },
    { agent: "David Kim", templateRatio: 73, manualRatio: 27, timeSaved: 35, efficiency: 87 },
    { agent: "Lisa Rodriguez", templateRatio: 88, manualRatio: 12, timeSaved: 44, efficiency: 93 }
  ];

  const weeklyProductivity = [
    { week: "Week 1", templates: 45, manual: 12, avgTime: 2.3 },
    { week: "Week 2", templates: 52, manual: 8, avgTime: 2.1 },
    { week: "Week 3", templates: 48, manual: 15, avgTime: 2.4 },
    { week: "Week 4", templates: 58, manual: 6, avgTime: 1.9 }
  ];

  const efficiencyMetrics = [
    { metric: "Avg Template Creation", value: "1.8 hrs", change: "-23%" },
    { metric: "Avg Manual Creation", value: "6.5 hrs", change: "+5%" },
    { metric: "Template vs Manual Ratio", value: "83:17", change: "+12%" },
    { metric: "Client Satisfaction", value: "4.7/5", change: "+0.3" }
  ];

  return (
    <div className="space-y-6">
      {/* Efficiency Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {efficiencyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{metric.value}</div>
              <p className={`text-xs mt-1 ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Template vs Manual Ratio */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Template Usage</CardTitle>
            <CardDescription>Template vs manual creation ratio by agent</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentProductivityData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="agent" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="templateRatio" stackId="a" fill="#3B82F6" name="Template %" />
                <Bar dataKey="manualRatio" stackId="a" fill="#EF4444" name="Manual %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time Saved by Agent */}
        <Card>
          <CardHeader>
            <CardTitle>Time Saved by Agent</CardTitle>
            <CardDescription>Hours saved through template usage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentProductivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="agent" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="timeSaved" fill="#10B981" name="Hours Saved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Productivity Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Productivity Trends</CardTitle>
            <CardDescription>Template vs manual creation over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyProductivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="templates" stroke="#3B82F6" name="Template Creations" strokeWidth={2} />
                <Line type="monotone" dataKey="manual" stroke="#EF4444" name="Manual Creations" strokeWidth={2} />
                <Line type="monotone" dataKey="avgTime" stroke="#10B981" name="Avg Hours per Itinerary" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentProductivityMetrics;
