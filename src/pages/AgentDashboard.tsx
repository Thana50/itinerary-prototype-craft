import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Handshake, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  LogOut,
  BarChart3,
  Briefcase,
  BookTemplate,
  Star,
  Clock,
  Loader2,
  Database,
  Download,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Trophy
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from 'recharts';
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
  const [showPocDataManager, setShowPocDataManager] = useState(false);
  
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

  // Calculate enterprise-grade KPIs
  const activeRevenuePipelines = itineraries.filter(i => i.status === 'draft' || i.status === 'shared').length;
  const activeItineraries = activeRevenuePipelines; // Keep for legacy references
  const approvedItineraries = itineraries.filter(i => i.approval_status === 'approved' && i.status !== 'confirmed').length;
  const pendingNegotiations = negotiations.filter(n => n.status === 'pending').length;
  
  const totalRevenue = itineraries
    .filter(i => i.status === 'confirmed')
    .reduce((sum, itinerary) => {
      return sum + (itinerary.days.length * itinerary.number_of_travelers * 200);
    }, 0);
  const closeRate = itineraries.length > 0 
    ? Math.round((itineraries.filter(i => i.status === 'confirmed').length / itineraries.length) * 100)
    : 0;
  const conversionRate = closeRate; // Keep for legacy references
  const timeSavedHours = negotiations.length * 12; // Estimate 12 hours saved per negotiation
  
  // Mock trend data for mini charts
  const revenueData = [
    { value: 45000 }, { value: 52000 }, { value: 49000 }, 
    { value: 63000 }, { value: 58000 }, { value: totalRevenue || 67000 }
  ];
  const pipelinesData = [
    { value: 12 }, { value: 15 }, { value: 14 }, 
    { value: 18 }, { value: 16 }, { value: activeRevenuePipelines || 20 }
  ];
  const closeRateData = [
    { value: 58 }, { value: 62 }, { value: 65 }, 
    { value: 68 }, { value: 70 }, { value: closeRate || 72 }
  ];
  const timeSavedData = [
    { value: 80 }, { value: 96 }, { value: 108 }, 
    { value: 132 }, { value: 144 }, { value: timeSavedHours || 156 }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))] relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Header */}
      <header className="glass-card border-b shadow-lg px-6 py-4 relative z-10">
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPocDataManager(!showPocDataManager)}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              {showPocDataManager ? 'Hide' : 'Show'} Demo Data
            </Button>
            {itineraries.length === 0 && <SeedDataButton />}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="mb-8 flex justify-between items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Executive Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Real-time business intelligence & performance analytics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 hover:scale-105 transition-transform">
              <Download className="h-4 w-4" />
              Export to PDF
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              <Share2 className="h-4 w-4" />
              Share Dashboard
            </Button>
          </div>
        </div>

        {/* PoC Demo Data Initializer - Show when toggled */}
        {showPocDataManager && (
          <div className="mb-8">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-orange-900 mb-4">PoC Demo Data Manager</h2>
              <p className="text-orange-700 mb-4">
                Initialize or refresh comprehensive demo data including vendor profiles, services, and sample itineraries.
              </p>
              <PocDataInitializer />
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
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

          <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100/80 rounded-lg mr-4">
                  <Handshake className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Negotiations</p>
                  <p className="text-3xl font-bold text-orange-600">{pendingNegotiations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100/80 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                  <p className="text-3xl font-bold text-green-600">{conversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100/80 rounded-lg mr-4">
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

        {/* Template Library Section - Streamlined */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Itinerary Management</h2>
              <p className="text-muted-foreground mt-1">Recent projects and templates</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/template-repository")}
              className="gap-2 hover:scale-105 transition-transform"
            >
              <BookTemplate className="h-4 w-4" />
              Template Library
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Projects</CardTitle>
                  <Badge variant="outline">{recentItineraries.length}</Badge>
                </div>
                <CardDescription>Your most recently created itineraries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentItineraries.length > 0 ? recentItineraries.map((itinerary) => (
                    <div key={itinerary.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl hover:from-primary/10 hover:to-accent/10 transition-all">
                      <div className="flex-1">
                        <p className="font-semibold">{itinerary.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {itinerary.destination} • {itinerary.days.length} days • {itinerary.status}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                        className="hover:scale-110 transition-transform"
                      >
                        View
                      </Button>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No itineraries created yet</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => navigate("/create-itinerary")}
                      >
                        Create First Itinerary
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Top Performers</CardTitle>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    <Star className="h-3 w-3 mr-1" />
                    Success
                  </Badge>
                </div>
                <CardDescription>Your most successful confirmed itineraries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformingItineraries.length > 0 ? topPerformingItineraries.map((itinerary, index) => (
                    <div key={itinerary.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl border border-green-500/10">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <div>
                          <p className="font-semibold">{itinerary.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {itinerary.number_of_travelers} travelers • Confirmed
                          </p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No confirmed itineraries yet</p>
                      <p className="text-sm mt-1">Your top performers will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Core Tools Section - Enterprise Style */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <Card 
              className="glass-card border-0 shadow-xl cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group"
              onClick={() => navigate("/create-itinerary")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <CardContent className="p-8 text-center relative">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Itinerary Builder</h3>
                <p className="text-muted-foreground text-sm">Create custom travel plans</p>
              </CardContent>
            </Card>

            <Card 
              className="glass-card border-0 shadow-xl cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group"
              onClick={() => navigate("/rate-negotiation")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <CardContent className="p-8 text-center relative">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Handshake className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Negotiator</h3>
                <p className="text-muted-foreground text-sm">Automate rate negotiations</p>
              </CardContent>
            </Card>

            <Card 
              className="glass-card border-0 shadow-xl cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group"
              onClick={() => navigate("/template-analytics")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <CardContent className="p-8 text-center relative">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-muted-foreground text-sm">Performance insights</p>
              </CardContent>
            </Card>

            <Card 
              className="glass-card border-0 shadow-xl cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group"
              onClick={() => navigate("/template-repository")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <CardContent className="p-8 text-center relative">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <BookTemplate className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Templates</h3>
                <p className="text-muted-foreground text-sm">Browse travel templates</p>
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
