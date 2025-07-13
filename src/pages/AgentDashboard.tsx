import React, { useState, useEffect } from "react";
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
  BookTemplate,
  Star,
  Clock,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { itineraryService } from "@/services/itineraryService";
import { negotiationService } from "@/services/negotiationService";
import type { Itinerary, Negotiation } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import SeedDataButton from "@/components/SeedDataButton";
import { PostApprovalDashboard } from "@/components/PostApprovalDashboard";
import PocDataInitializer from "@/components/PocDataInitializer";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const [itinerariesData, negotiationsData] = await Promise.all([
        itineraryService.getAgentItineraries(user.id),
        negotiationService.getAgentNegotiations(user.id)
      ]);
      
      setItineraries(itinerariesData);
      setNegotiations(negotiationsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  // Calculate stats from real data
  const activeItineraries = itineraries.filter(i => i.status === 'draft' || i.status === 'shared').length;
  const approvedItineraries = itineraries.filter(i => i.approval_status === 'approved' && i.status !== 'confirmed').length;
  const pendingNegotiations = negotiations.filter(n => n.status === 'pending').length;
  const totalRevenue = itineraries
    .filter(i => i.status === 'confirmed')
    .reduce((sum, itinerary) => {
      // Estimate revenue based on itinerary complexity (this would be real revenue data in production)
      return sum + (itinerary.days.length * itinerary.number_of_travelers * 200);
    }, 0);
  const conversionRate = itineraries.length > 0 
    ? Math.round((itineraries.filter(i => i.status === 'confirmed').length / itineraries.length) * 100)
    : 0;

  // Get approved itineraries for negotiation
  const approvedForNegotiation = itineraries.filter(i => 
    i.approval_status === 'approved' && i.status !== 'confirmed'
  ).slice(0, 5);
  
  // Get recent itineraries for templates section
  const recentItineraries = itineraries
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);
  
  // Get top performing itineraries (confirmed ones)
  const topPerformingItineraries = itineraries
    .filter(i => i.status === 'confirmed')
    .slice(0, 3);

  // Get recent activity from itineraries and negotiations
  const getRecentActivity = () => {
    const activities: Array<{type: string, message: string, time: string, color: string}> = [];
    
    // Add recent itineraries
    itineraries.slice(0, 2).forEach(itinerary => {
      activities.push({
        type: 'itinerary',
        message: `Itinerary created for '${itinerary.name}'`,
        time: new Date(itinerary.created_at).toLocaleString(),
        color: 'bg-green-500'
      });
    });
    
    // Add recent negotiations
    negotiations.slice(0, 2).forEach(negotiation => {
      activities.push({
        type: 'negotiation',
        message: `Rate negotiation ${negotiation.status} for '${negotiation.service_type}'`,
        time: new Date(negotiation.created_at).toLocaleString(),
        color: negotiation.status === 'pending' ? 'bg-orange-500' : 'bg-blue-500'
      });
    });
    
    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 3);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }
  
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
            <span className="text-gray-600">Welcome, {user?.name || 'Agent'}!</span>
            {itineraries.length === 0 && <SeedDataButton />}
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

        {/* PoC Demo Data Initializer - Show prominently for easy access */}
        <div className="mb-8">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-orange-900 mb-4">PoC Demo Data Manager</h2>
            <p className="text-orange-700 mb-4">
              Initialize or refresh comprehensive demo data including vendor profiles, services, and sample itineraries.
            </p>
            <PocDataInitializer />
          </div>
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
                  <p className="text-3xl font-bold text-blue-600">{activeItineraries}</p>
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
                  <p className="text-3xl font-bold text-orange-600">{pendingNegotiations}</p>
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
                  <p className="text-3xl font-bold text-green-600">{conversionRate}%</p>
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
                  <p className="text-sm font-medium text-gray-500">Estimated Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Post-Approval Workflow Dashboards */}
        {approvedForNegotiation.map((itinerary) => (
          <div key={`workflow-${itinerary.id}`} className="mb-8">
            <PostApprovalDashboard 
              itineraryId={itinerary.id}
              className="border-l-4 border-l-orange-500"
            />
          </div>
        ))}

        {/* Approved Itineraries Section */}
        {approvedItineraries > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Approved Itineraries Awaiting Negotiation
                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                  {approvedItineraries} pending
                </span>
              </h2>
              <Button 
                variant="outline" 
                onClick={() => navigate("/rate-negotiation-ai")}
                className="text-orange-600 border-orange-600 hover:bg-orange-50"
              >
                View All Negotiations
              </Button>
            </div>
            
            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {approvedForNegotiation.map((itinerary) => (
                    <div key={itinerary.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{itinerary.name}</h3>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {itinerary.number_of_travelers} travelers • {itinerary.days.length} days
                            </p>
                            <p className="text-xs text-orange-600 font-medium">
                              Approved {new Date(itinerary.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          📍 {itinerary.destination} • {itinerary.start_date} to {itinerary.end_date}
                        </p>
                      </div>
                      <div className="ml-4 space-x-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/rate-negotiation-ai?itinerary=${itinerary.id}`)}
                        >
                          View Progress
                        </Button>
                        <Button 
                          onClick={() => navigate(`/itinerary/${itinerary.id}/negotiate`)}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Manual Override
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Template Library Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Itineraries</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate("/template-repository")}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              View Template Repository
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
                    <p className="text-sm font-medium text-gray-600">Itineraries Created</p>
                    <p className="text-2xl font-bold text-blue-700">{itineraries.length}</p>
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
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-green-700">{conversionRate}%</p>
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
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold text-purple-700">{activeItineraries}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent and Top Performing Itineraries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Itineraries</CardTitle>
                <CardDescription>Your most recently created itineraries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentItineraries.length > 0 ? recentItineraries.map((itinerary) => (
                    <div key={itinerary.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{itinerary.name}</p>
                        <p className="text-sm text-gray-600">
                          {itinerary.destination} • {itinerary.days.length} days • {itinerary.status}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No itineraries created yet.</p>
                      <Button 
                        className="mt-2" 
                        onClick={() => navigate("/create-itinerary")}
                      >
                        Create Your First Itinerary
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performing Itineraries</CardTitle>
                <CardDescription>Your most successful confirmed itineraries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformingItineraries.length > 0 ? topPerformingItineraries.map((itinerary, index) => (
                    <div key={itinerary.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-gray-900">{itinerary.name}</p>
                        <p className="text-sm text-green-700">
                          Confirmed • {itinerary.number_of_travelers} travelers
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-700">
                          {index === 0 ? '🏆 #1' : index === 1 ? '🥈 #2' : '🥉 #3'}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No confirmed itineraries yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Core Tools Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Core Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className="bg-green-500 text-white cursor-pointer hover:bg-green-600 transition-colors"
              onClick={() => navigate("/template-analytics")}
            >
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-green-100">View performance and insights.</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600 transition-colors"
              onClick={() => navigate("/template-repository")}
            >
              <CardContent className="p-8 text-center">
                <BookTemplate className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Template Repository</h3>
                <p className="text-indigo-100">Browse and manage travel templates.</p>
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
              {getRecentActivity().length > 0 ? getRecentActivity().map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 ${activity.color} rounded-full mr-3`}></div>
                    <span className="text-gray-900">{activity.message}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{activity.time}</span>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity.</p>
                </div>
              )}
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
