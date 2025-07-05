
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Handshake, 
  TrendingUp, 
  DollarSign, 
  LogOut,
  BarChart3,
  Briefcase,
  Users,
  BookTemplate,
  Star,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear any stored user data/tokens here if needed
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0eec4e7f-1447-475b-928f-96fbc0eca6e8.png" 
              alt="Travia Logo" 
              className="h-14 w-auto mr-4"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, Agent!</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Itineraries</p>
                  <p className="text-3xl font-bold text-blue-600">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg mr-4">
                  <Handshake className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Negotiations</p>
                  <p className="text-3xl font-bold text-orange-600">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                  <p className="text-3xl font-bold text-green-600">35%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue (Month)</p>
                  <p className="text-3xl font-bold text-purple-600">$12,500</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Library Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Template Library</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate("/template-repository")}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              View All Templates
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Template Stats Cards */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <BookTemplate className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Templates Created</p>
                    <p className="text-2xl font-bold text-blue-700">23</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Success Rate</p>
                    <p className="text-2xl font-bold text-green-700">94%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time Saved</p>
                    <p className="text-2xl font-bold text-purple-700">67%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Templates and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Templates Used</CardTitle>
                <CardDescription>Your most recently accessed templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Phuket Beach Paradise</p>
                      <p className="text-sm text-gray-600">7 days • 4.8★ • Used 2 hours ago</p>
                    </div>
                    <Button size="sm" variant="outline">Use</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Singapore Family Adventure</p>
                      <p className="text-sm text-gray-600">5 days • 4.6★ • Used yesterday</p>
                    </div>
                    <Button size="sm" variant="outline">Use</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Bali Cultural Immersion</p>
                      <p className="text-sm text-gray-600">6 days • 4.7★ • Used 3 days ago</p>
                    </div>
                    <Button size="sm" variant="outline">Use</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performing Templates</CardTitle>
                <CardDescription>Your most successful templates this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-medium text-gray-900">Dubai Luxury Escape</p>
                      <p className="text-sm text-green-700">100% success rate • 8 bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-700">🏆 #1</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-medium text-gray-900">Tokyo Cultural Journey</p>
                      <p className="text-sm text-blue-700">96% success rate • 12 bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-700">🥈 #2</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div>
                      <p className="font-medium text-gray-900">Morocco Adventure</p>
                      <p className="text-sm text-orange-700">94% success rate • 6 bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-700">🥉 #3</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Core Tools Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Core Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition-colors"
              onClick={() => navigate("/create-itinerary")}
            >
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Itinerary Builder</h3>
                <p className="text-blue-100">Create and manage travel itineraries.</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-orange-500 text-white cursor-pointer hover:bg-orange-600 transition-colors"
              onClick={() => navigate("/rate-negotiation")}
            >
              <CardContent className="p-8 text-center">
                <Handshake className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Rate Negotiator</h3>
                <p className="text-orange-100">Negotiate rates with service providers.</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-purple-500 text-white cursor-pointer hover:bg-purple-600 transition-colors"
              onClick={() => navigate("/client-portal")}
            >
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Client AI Portal</h3>
                <p className="text-purple-100">Let clients customize their trips with AI.</p>
              </CardContent>
            </Card>

            <Card className="bg-green-500 text-white cursor-pointer hover:bg-green-600 transition-colors">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-green-100">View performance and insights.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-900">New itinerary created for 'Paris Getaway'</span>
                </div>
                <span className="text-gray-500 text-sm">2h ago</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-900">Rate negotiation started for 'Bali Adventure'</span>
                </div>
                <span className="text-gray-500 text-sm">5h ago</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-900">Client 'John Doe' approved 'Rome Holiday'</span>
                </div>
                <span className="text-gray-500 text-sm">1 day ago</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="link" className="text-blue-500 p-0">
                View all activity →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          © 2025 Travia. Where Custom Trips Click.
        </footer>
      </div>
    </div>
  );
};

export default AgentDashboard;
