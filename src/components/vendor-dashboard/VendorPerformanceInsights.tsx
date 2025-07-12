
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Award, 
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface VendorPerformanceInsightsProps {
  vendorId: string;
}

const VendorPerformanceInsights = ({ vendorId }: VendorPerformanceInsightsProps) => {
  // Mock performance data
  const performanceMetrics = {
    overall: {
      score: 92,
      rank: 2,
      tier: "Gold",
      improvement: "+5.2%"
    },
    responseTime: {
      average: 4.2,
      target: 6.0,
      trend: "improving",
      last30Days: [
        { day: 1, time: 5.2 },
        { day: 7, time: 4.8 },
        { day: 14, time: 4.1 },
        { day: 21, time: 3.9 },
        { day: 30, time: 4.2 }
      ]
    },
    successRate: {
      current: 89,
      target: 85,
      byServiceType: [
        { type: "Hotel", rate: 94, volume: 45 },
        { type: "Tours", rate: 87, volume: 23 },
        { type: "Transfer", rate: 91, volume: 32 }
      ]
    },
    revenue: {
      thisMonth: 18420,
      lastMonth: 14780,
      growth: 24.6,
      forecast: 21500
    },
    negotiationInsights: {
      avgRounds: 2.3,
      quickWins: 67, // negotiations closed in 1 round
      conversionRate: 89,
      discountGiven: 12.5
    }
  };

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900">
                  Performance Score: {performanceMetrics.overall.score}/100
                </h3>
                <p className="text-blue-700">
                  Rank #{performanceMetrics.overall.rank} • {performanceMetrics.overall.tier} Tier
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`${getScoreBadgeColor(performanceMetrics.overall.score)} text-white`}>
                {performanceMetrics.overall.improvement} this month
              </Badge>
              <p className="text-sm text-blue-600 mt-1">Above target</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-xl font-bold text-gray-900">
                  {performanceMetrics.responseTime.average}h
                </p>
                <p className="text-xs text-green-600">30% faster than target</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-xl font-bold text-gray-900">
                  {performanceMetrics.successRate.current}%
                </p>
                <p className="text-xs text-green-600">Above industry avg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Revenue Growth</p>
                <p className="text-xl font-bold text-gray-900">
                  +{performanceMetrics.revenue.growth}%
                </p>
                <p className="text-xs text-purple-600">vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Quick Wins</p>
                <p className="text-xl font-bold text-gray-900">
                  {performanceMetrics.negotiationInsights.quickWins}%
                </p>
                <p className="text-xs text-orange-600">1-round closures</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Response Time Trend (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceMetrics.responseTime.last30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}h`, 'Response Time']} />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <TrendingDown className="h-4 w-4 inline mr-1" />
                Consistently improving - 23% faster than last month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate by Service Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Success Rate by Service Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={performanceMetrics.successRate.byServiceType}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="rate"
                  label={({ type, rate }) => `${type}: ${rate}%`}
                >
                  {performanceMetrics.successRate.byServiceType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Negotiation Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Average Rounds to Close</span>
                  <span className="font-medium">{performanceMetrics.negotiationInsights.avgRounds}</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">25% better than average</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="font-medium">{performanceMetrics.negotiationInsights.conversionRate}%</span>
                </div>
                <Progress value={89} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Excellent performance</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Average Discount Given</span>
                  <span className="font-medium">{performanceMetrics.negotiationInsights.discountGiven}%</span>
                </div>
                <Progress value={12.5} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Balanced pricing strategy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Improvement Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Strength: Quick Response</p>
                    <p className="text-sm text-green-700">Your 4.2h average response time is 30% faster than target</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Opportunity: Tours Success Rate</p>
                    <p className="text-sm text-yellow-700">Focus on improving tours negotiation from 87% to 90%+</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Growth: Premium Positioning</p>
                    <p className="text-sm text-blue-700">Consider 5-8% rate increase during peak season</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorPerformanceInsights;
