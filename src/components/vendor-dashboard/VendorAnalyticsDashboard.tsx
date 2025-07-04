
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Download, Target, Award, Clock, DollarSign } from "lucide-react";

const VendorAnalyticsDashboard = () => {
  const monthlyRevenue = [
    { month: 'Sep', revenue: 12450, nights: 42 },
    { month: 'Oct', revenue: 14780, nights: 48 },
    { month: 'Nov', revenue: 11230, nights: 38 },
    { month: 'Dec', revenue: 16890, nights: 52 },
    { month: 'Jan', revenue: 13650, nights: 45 },
    { month: 'Feb', revenue: 18420, nights: 58 }
  ];

  const responseTimeData = [
    { time: '<2h', success: 96 },
    { time: '2-6h', success: 89 },
    { time: '6-12h', success: 82 },
    { time: '12-24h', success: 74 },
    { time: '>24h', success: 61 }
  ];

  const marketShareData = [
    { name: 'Your Property', value: 23, nights: 58 },
    { name: 'Competitor A', value: 19, nights: 48 },
    { name: 'Competitor B', value: 16, nights: 40 },
    { name: 'Others', value: 42, nights: 105 }
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#6b7280'];

  const agencyPartners = [
    {
      name: "Travia Travel",
      tier: "Gold",
      bookings: 28,
      avgRate: 162,
      successRate: 100,
      health: "Excellent",
      healthColor: "bg-green-500",
      nextAction: "5 pending requests"
    },
    {
      name: "Desert Rose Travel",
      tier: "Silver", 
      bookings: 18,
      avgRate: 148,
      successRate: 89,
      health: "Good",
      healthColor: "bg-yellow-500",
      nextAction: "Upgrade to Gold tier"
    },
    {
      name: "Islamic Travel Specialists",
      tier: "Silver",
      bookings: 12,
      avgRate: 155,
      successRate: 92,
      health: "Excellent",
      healthColor: "bg-green-500",
      nextAction: "Cultural service premium"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Monthly Revenue Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toLocaleString()}` : `${value} nights`,
                  name === 'revenue' ? 'Revenue' : 'Room Nights'
                ]} />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                February: $18,420 (58 nights) ↗️ +35% growth
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Response Time Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                <Line type="monotone" dataKey="success" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800 font-medium">
                Responding within 2 hours increases success rate to 96%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Negotiation Success by Agency Tier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-yellow-800">Gold Partners</span>
                <Badge className="bg-yellow-500 text-white">Premium</Badge>
              </div>
              <p className="text-2xl font-bold text-yellow-900">94%</p>
              <p className="text-sm text-yellow-700">acceptance rate (8% avg discount)</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">Silver Partners</span>
                <Badge variant="outline">Standard</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">87%</p>
              <p className="text-sm text-gray-700">acceptance rate (12% avg discount)</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-800">New Partners</span>
                <Badge className="bg-blue-500 text-white">Growing</Badge>
              </div>
              <p className="text-2xl font-bold text-blue-900">73%</p>
              <p className="text-sm text-blue-700">acceptance rate (18% avg discount)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Position */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Share Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={marketShareData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {marketShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Leading market position with 23% share (58 nights)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Competitiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Peak Season</p>
                  <p className="text-sm text-green-600">8% above market average</p>
                </div>
                <Badge className="bg-green-500 text-white">Premium ✅</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800">Shoulder Season</p>
                  <p className="text-sm text-blue-600">3% above market average</p>
                </div>
                <Badge className="bg-blue-500 text-white">Competitive ✅</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-800">Low Season</p>
                  <p className="text-sm text-orange-600">2% below market average</p>
                </div>
                <Badge className="bg-orange-500 text-white">Aggressive ✅</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agency Relationships */}
      <Card>
        <CardHeader>
          <CardTitle>Top Agency Partnerships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agencyPartners.map((agency, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-white to-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg">{index + 1}. {agency.name}</span>
                    <Badge variant="outline">{agency.tier}</Badge>
                    <div className={`w-3 h-3 rounded-full ${agency.healthColor}`}></div>
                    <span className="text-sm text-gray-600">{agency.health}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{agency.successRate}% Success Rate</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Bookings:</span>
                    <p className="font-medium">{agency.bookings} nights</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Average Rate:</span>
                    <p className="font-medium">${agency.avgRate}/night</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Next Opportunity:</span>
                    <p className="font-medium text-blue-600">{agency.nextAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Immediate Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">🎯 Respond to Travia Travel request within 2 hours</p>
                <p className="text-xs text-red-600">(96% success rate)</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">🎯 Offer breakfast inclusion to new agencies</p>
                <p className="text-xs text-blue-600">(increases acceptance 34%)</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">🎯 Counter-offer Desert Rose at $145/night</p>
                <p className="text-xs text-green-600">(87% acceptance probability)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Strategic Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800 font-medium">📈 Upgrade Desert Rose to Gold tier</p>
                <p className="text-xs text-purple-600">(potential +$3,200 annual revenue)</p>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-indigo-800 font-medium">📈 Target Islamic travel market packages</p>
                <p className="text-xs text-indigo-600">(+15% rate premium opportunity)</p>
              </div>
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <p className="text-sm text-teal-800 font-medium">📈 Implement dynamic pricing for shoulder season</p>
                <p className="text-xs text-teal-600">(+8% revenue potential)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Forecasting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">March 2025 Forecast</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-blue-700">Expected Requests:</span> 15-18 negotiations</p>
                <p><span className="text-blue-700">Projected Revenue:</span> $19,500-22,800</p>
                <p><span className="text-blue-700">Peak Dates:</span> March 15-25 (premium pricing)</p>
                <p><span className="text-blue-700">Cultural Events:</span> Ramadan prep (+20% ME bookings)</p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-3">April 2025 Forecast</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-green-700">Expected Requests:</span> 12-15 negotiations</p>
                <p><span className="text-green-700">Projected Revenue:</span> $16,200-19,500</p>
                <p><span className="text-green-700">Market Trend:</span> Shoulder season (increase flexibility)</p>
                <p><span className="text-green-700">Opportunity:</span> Group booking season starts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Benchmarking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-gold-600" />
            Performance vs Industry Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-800">Response Time</span>
                <div className="text-right">
                  <p className="font-bold text-green-900">4.2h vs 8.7h</p>
                  <p className="text-xs text-green-600">48% faster ✅</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-800">Success Rate</span>
                <div className="text-right">
                  <p className="font-bold text-green-900">89% vs 76%</p>
                  <p className="text-xs text-green-600">+17% better ✅</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-800">Rate Premium</span>
                <div className="text-right">
                  <p className="font-bold text-green-900">8% vs 3%</p>
                  <p className="text-xs text-green-600">Premium positioning ✅</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-800">Customer Satisfaction</span>
                <div className="text-right">
                  <p className="font-bold text-green-900">4.8/5 vs 4.1/5</p>
                  <p className="text-xs text-green-600">+17% higher ✅</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
            <p className="font-bold text-yellow-900 text-lg">Partnership Score: 92/100</p>
            <p className="text-yellow-700">(Top 10% of vendors)</p>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Monthly Report (PDF)
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Agency Data (Excel)
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Revenue Forecast (PDF)
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Success Metrics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorAnalyticsDashboard;
