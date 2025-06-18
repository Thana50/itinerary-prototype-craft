
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIDecisionEngine from "./AIDecisionEngine";
import MarketIntelligence from "./MarketIntelligence";
import RealTimeDecisions from "./RealTimeDecisions";
import PerformanceAnalytics from "./PerformanceAnalytics";
import CustomAIRules from "./CustomAIRules";

const AIIntelligenceDashboard = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-900">AI Intelligence Control Center</CardTitle>
          <p className="text-purple-700">Monitor, control, and customize your AI negotiation assistant</p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="decision-engine" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="decision-engine">Decision Engine</TabsTrigger>
          <TabsTrigger value="market-intel">Market Intelligence</TabsTrigger>
          <TabsTrigger value="real-time">Real-Time Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="custom-rules">Custom Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="decision-engine" className="mt-6">
          <AIDecisionEngine />
        </TabsContent>

        <TabsContent value="market-intel" className="mt-6">
          <MarketIntelligence />
        </TabsContent>

        <TabsContent value="real-time" className="mt-6">
          <RealTimeDecisions />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <PerformanceAnalytics />
        </TabsContent>

        <TabsContent value="custom-rules" className="mt-6">
          <CustomAIRules />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIIntelligenceDashboard;
