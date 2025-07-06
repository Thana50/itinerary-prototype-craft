
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Clock, Users, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TemplatePerformanceCharts from "@/components/template-analytics/TemplatePerformanceCharts";
import AgentProductivityMetrics from "@/components/template-analytics/AgentProductivityMetrics"; 
import TemplateOptimizationInsights from "@/components/template-analytics/TemplateOptimizationInsights";
import ROICalculation from "@/components/template-analytics/ROICalculation";
import TemplateLifecycleView from "@/components/template-analytics/TemplateLifecycleView";
import AnalyticsOverviewCards from "@/components/template-analytics/AnalyticsOverviewCards";

const TemplateAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/agent-dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Template Analytics</h1>
              <p className="text-gray-600">Performance insights and optimization data</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Travia Agent Portal</p>
            <p className="text-xs text-blue-600 font-medium">Where Custom Trips Click</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Cards */}
        <AnalyticsOverviewCards timeRange={selectedTimeRange} />

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="performance" className="mt-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
            <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-6">
            <TemplatePerformanceCharts timeRange={selectedTimeRange} />
          </TabsContent>

          <TabsContent value="productivity" className="mt-6">
            <AgentProductivityMetrics timeRange={selectedTimeRange} />
          </TabsContent>

          <TabsContent value="optimization" className="mt-6">
            <TemplateOptimizationInsights timeRange={selectedTimeRange} />
          </TabsContent>

          <TabsContent value="roi" className="mt-6">
            <ROICalculation timeRange={selectedTimeRange} />
          </TabsContent>

          <TabsContent value="lifecycle" className="mt-6">
            <TemplateLifecycleView timeRange={selectedTimeRange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TemplateAnalyticsDashboard;
