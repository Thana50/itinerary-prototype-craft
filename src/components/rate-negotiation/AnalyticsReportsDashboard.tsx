
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  Star,
  Download,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Target,
  BarChart3,
  PieChart,
  FileText
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const AnalyticsReportsDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");

  // Performance data
  const performanceStats = {
    totalSavings: { amount: 12847, trend: 23, subtitle: "Across 47 successful negotiations" },
    successRate: { percentage: 89.4, trend: 5.2, subtitle: "42 successful / 47 total negotiations" },
    avgTime: { hours: 16.8, trend: -3.2, subtitle: "AI automation reducing time" },
    satisfaction: { score: 4.7, trend: 0.3, subtitle: "Based on 23 post-trip surveys" }
  };

  // Chart data
  const monthlyPerformanceData = [
    { month: 'Sep', negotiations: 15, successRate: 82 },
    { month: 'Oct', negotiations: 23, successRate: 85 },
    { month: 'Nov', negotiations: 31, successRate: 88 },
    { month: 'Dec', negotiations: 28, successRate: 87 },
    { month: 'Jan', negotiations: 35, successRate: 91 },
    { month: 'Feb', negotiations: 47, successRate: 89 }
  ];

  const savingsByServiceData = [
    { name: 'Hotels', value: 7969, percentage: 62, color: '#3B82F6' },
    { name: 'Tours', value: 2698, percentage: 21, color: '#10B981' },
    { name: 'Transfers', value: 1542, percentage: 12, color: '#F59E0B' },
    { name: 'Activities', value: 638, percentage: 5, color: '#EF4444' }
  ];

  const topProviders = [
    {
      name: "Phuket Beach Resort & Spa",
      negotiations: 8,
      successRate: 100,
      avgResponseTime: 4.2,
      avgDiscount: 12,
      rating: 5
    },
    {
      name: "Bangkok Elite Transfers",
      negotiations: 12,
      successRate: 92,
      avgResponseTime: 2.1,
      avgDiscount: 18,
      rating: 5
    },
    {
      name: "Phi Phi Island Tours",
      negotiations: 6,
      successRate: 83,
      avgResponseTime: 8.7,
      avgDiscount: 15,
      rating: 4
    }
  ];

  const needAttentionProviders = [
    "Krabi Beach Resort: 3 pending negotiations (72+ hours)",
    "Samui Activities Co: Low success rate (67%) - review approach",
    "Island Hopping Tours: Slow response (24+ hours average)"
  ];

  const monthlyGoals = [
    { name: "Total Savings Target", target: 15000, achieved: 12847, percentage: 85 },
    { name: "Success Rate Target", target: 90, achieved: 89.4, percentage: 99 },
    { name: "Response Time Target", target: 15, achieved: 16.8, percentage: 89 },
    { name: "Client Satisfaction Target", target: 4.5, achieved: 4.7, percentage: 104 }
  ];

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = (trend: number) => {
    return trend > 0 ? "text-green-600" : "text-red-600";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${performanceStats.totalSavings.amount.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(performanceStats.totalSavings.trend)}
              <span className={`ml-1 ${getTrendColor(performanceStats.totalSavings.trend)}`}>
                +{performanceStats.totalSavings.trend}% vs last month
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {performanceStats.totalSavings.subtitle}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.successRate.percentage}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(performanceStats.successRate.trend)}
              <span className={`ml-1 ${getTrendColor(performanceStats.successRate.trend)}`}>
                +{performanceStats.successRate.trend}% vs last month
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {performanceStats.successRate.subtitle}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Negotiation Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.avgTime.hours} hours</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(performanceStats.avgTime.trend)}
              <span className={`ml-1 ${getTrendColor(performanceStats.avgTime.trend)}`}>
                {performanceStats.avgTime.trend} hours vs last month
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {performanceStats.avgTime.subtitle}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.satisfaction.score}/5.0</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(performanceStats.satisfaction.trend)}
              <span className={`ml-1 ${getTrendColor(performanceStats.satisfaction.trend)}`}>
                +{performanceStats.satisfaction.trend} vs last month
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {performanceStats.satisfaction.subtitle}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Monthly Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="negotiations" fill="#3B82F6" name="Total Negotiations" />
                    <Line yAxisId="right" type="monotone" dataKey="successRate" stroke="#10B981" strokeWidth={2} name="Success Rate %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Savings by Service Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-green-600" />
                  Savings by Service Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <RechartsPieChart data={savingsByServiceData}>
                      {savingsByServiceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {savingsByServiceData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="text-sm font-medium">
                        ${item.value.toLocaleString()} ({item.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Top Performing Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProviders.map((provider, index) => (
                    <div key={provider.name} className="border rounded-lg p-4 bg-gradient-to-r from-white to-blue-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center">
                            <Badge className="bg-blue-500 text-white mr-2">#{index + 1}</Badge>
                            <h4 className="font-semibold text-gray-800">{provider.name}</h4>
                          </div>
                          <div className="flex items-center mt-1">
                            {renderStars(provider.rating)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Negotiations: <span className="font-medium">{provider.negotiations}</span></p>
                          <p className="text-gray-600">Success Rate: <span className="font-medium text-green-600">{provider.successRate}%</span></p>
                        </div>
                        <div>
                          <p className="text-gray-600">Response Time: <span className="font-medium">{provider.avgResponseTime}h</span></p>
                          <p className="text-gray-600">Avg Discount: <span className="font-medium text-blue-600">{provider.avgDiscount}%</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Need Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                  Providers Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {needAttentionProviders.map((provider, index) => (
                    <div key={index} className="border-l-4 border-orange-400 pl-4 py-2 bg-orange-50">
                      <p className="text-sm text-gray-700">{provider}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                  Review Provider Relationships
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Performance */}
            <Card>
              <CardHeader>
                <CardTitle>AI Decision Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Decisions made by AI</span>
                    <span className="font-semibold">78% (247/316)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Decisions overridden by agents</span>
                    <span className="font-semibold">22% (69/316)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI decisions proven correct</span>
                    <span className="font-semibold text-green-600">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Override decisions proven better</span>
                    <span className="font-semibold text-blue-600">13%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Improvement Areas */}
            <Card>
              <CardHeader>
                <CardTitle>AI Improvement Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50">
                    <p className="text-sm">AI underestimated provider flexibility in 12% of cases</p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-4 py-2 bg-green-50">
                    <p className="text-sm">Cultural requirements handling improved 23% this month</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-4 py-2 bg-purple-50">
                    <p className="text-sm">Timing optimization accuracy increased to 91%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Monthly Business Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Generate comprehensive monthly report for management
                </p>
                <ul className="text-xs text-gray-500 space-y-1 mb-4">
                  <li>• Total savings achieved</li>
                  <li>• Provider relationship status</li>
                  <li>• Agent productivity improvements</li>
                  <li>• Client satisfaction trends</li>
                  <li>• ROI on Travia platform</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Provider Performance Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Analyze individual provider relationships
                </p>
                <ul className="text-xs text-gray-500 space-y-1 mb-4">
                  <li>• Response time trends</li>
                  <li>• Success rate analysis</li>
                  <li>• Rate competitiveness</li>
                  <li>• Value-add offerings</li>
                  <li>• Relationship health score</li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-purple-600" />
                  Client Impact Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Measure client satisfaction and value delivery
                </p>
                <ul className="text-xs text-gray-500 space-y-1 mb-4">
                  <li>• Savings achieved per client</li>
                  <li>• Trip enhancement through negotiations</li>
                  <li>• Response time to client requests</li>
                  <li>• Post-trip satisfaction correlation</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Agent Productivity Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Track agent efficiency and AI assistance impact
                </p>
                <ul className="text-xs text-gray-500 space-y-1 mb-4">
                  <li>• Time saved per negotiation</li>
                  <li>• Success rate comparison</li>
                  <li>• Override decision accuracy</li>
                  <li>• Learning curve progression</li>
                </ul>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export & Sharing Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export Monthly Report (PDF)
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Report to Manager
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Automated Reports
                </Button>
                <Button variant="outline" className="flex items-center">
                  Share Dashboard Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Monthly Goals Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {monthlyGoals.map((goal) => (
                    <div key={goal.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{goal.name}</span>
                        <span className="text-sm text-gray-600">
                          {goal.name.includes('Rate') || goal.name.includes('Satisfaction') 
                            ? `${goal.achieved}${goal.name.includes('Satisfaction') ? '/5' : '%'} / ${goal.target}${goal.name.includes('%') ? '%' : goal.name.includes('Satisfaction') ? '/5' : ''}`
                            : `$${goal.achieved.toLocaleString()} / $${goal.target.toLocaleString()}`
                          }
                        </span>
                      </div>
                      <Progress value={Math.min(goal.percentage, 100)} className="h-2" />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">{goal.percentage}% achieved</span>
                        {goal.percentage >= 100 && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Annual Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Annual Goals Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Total Savings Target</span>
                      <span className="text-sm text-gray-600">$80,400 / $120,000</span>
                    </div>
                    <Progress value={67} className="h-2" />
                    <span className="text-xs text-gray-500">67% achieved YTD</span>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Provider Network</span>
                      <span className="text-sm text-gray-600">38 / 50 providers</span>
                    </div>
                    <Progress value={76} className="h-2" />
                    <span className="text-xs text-gray-500">76% achieved</span>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Agent Productivity</span>
                      <span className="text-sm text-gray-600">2.8x / 3x improvement</span>
                    </div>
                    <Progress value={93} className="h-2" />
                    <span className="text-xs text-gray-500">93% achieved</span>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Platform ROI</span>
                      <span className="text-sm text-gray-600">387% / 400%</span>
                    </div>
                    <Progress value={97} className="h-2" />
                    <span className="text-xs text-gray-500">97% achieved</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forecasting & Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Forecasting & Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">Upcoming Opportunities</h4>
                  <div className="space-y-2 text-sm">
                    <p>• Spring season (Mar-May): Expect 25% increase in negotiation volume</p>
                    <p>• Ramadan period: Focus on cultural accommodation providers</p>
                    <p>• New provider onboarding: 5 properties awaiting partnership setup</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Success Patterns</h4>
                  <div className="space-y-2 text-sm">
                    <p>• Group bookings (4+ people) achieve 23% better rates on average</p>
                    <p>• Tuesday 9-11 AM emails have 34% higher response rates</p>
                    <p>• Mentioning volume business increases success rate by 15%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsReportsDashboard;
