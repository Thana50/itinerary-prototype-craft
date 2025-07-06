
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Users, Target } from "lucide-react";

interface AnalyticsOverviewCardsProps {
  timeRange: string;
}

const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({ timeRange }) => {
  const overviewData = {
    totalTemplates: 47,
    avgSuccessRate: 92.3,
    timeSaved: 156,
    templatesUsed: 284
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
          <Target className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{overviewData.totalTemplates}</div>
          <p className="text-xs text-green-600 mt-1">
            +3 new this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{overviewData.avgSuccessRate}%</div>
          <p className="text-xs text-green-600 mt-1">
            +2.4% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hours Saved</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{overviewData.timeSaved}h</div>
          <p className="text-xs text-green-600 mt-1">
            This month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Templates Used</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{overviewData.templatesUsed}</div>
          <p className="text-xs text-green-600 mt-1">
            +18% usage rate
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverviewCards;
