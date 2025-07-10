
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Edit, Share, LogOut, MapPin, Clock, CheckCircle, AlertCircle, Plane, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ItineraryList from "@/components/ItineraryList";
import ConversationalAgent from "@/components/ConversationalAgent";

const TravelerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="/lovable-uploads/0eec4e7f-1447-475b-928f-96fbc0eca6e8.png" 
                  alt="Travia Logo" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome back, {user?.name || 'Traveler'}!
                </h1>
                <p className="text-lg text-gray-600 mt-1">Your travel adventures await</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Traveler
                  </Badge>
                  <span className="text-gray-500 flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    Premium Member
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200 shadow-sm">
                <p className="text-sm text-gray-600">Quick Actions</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Search className="h-3 w-3 mr-1" />
                    Find Trips
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs">
                    <LogOut className="h-3 w-3 mr-1" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-blue-100">Next Trip</CardDescription>
                  <CardTitle className="text-2xl font-bold text-white">European Adventure</CardTitle>
                </div>
                <Plane className="h-8 w-8 text-blue-200" />
              </div>
            </CardHeader>
            <CardContent className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-200" />
              <span className="text-blue-100">June 15 - June 30, 2025</span>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-purple-100">Status</CardDescription>
                  <CardTitle className="text-2xl font-bold text-white">Under Review</CardTitle>
                </div>
                <Edit className="h-8 w-8 text-purple-200" />
              </div>
            </CardHeader>
            <CardContent className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-purple-200" />
              <span className="text-purple-100">2 modifications pending</span>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-green-100">Destinations</CardDescription>
                  <CardTitle className="text-2xl font-bold text-white">3 Countries</CardTitle>
                </div>
                <MapPin className="h-8 w-8 text-green-200" />
              </div>
            </CardHeader>
            <CardContent className="flex items-center">
              <span className="text-green-100">France, Italy, Spain</span>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-orange-100">Duration</CardDescription>
                  <CardTitle className="text-2xl font-bold text-white">15 Days</CardTitle>
                </div>
                <Clock className="h-8 w-8 text-orange-200" />
              </div>
            </CardHeader>
            <CardContent className="flex items-center">
              <span className="text-orange-100">Perfect vacation length</span>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-800">Your Itineraries</CardTitle>
                    <CardDescription className="text-gray-600">Review and modify your travel plans</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Share className="h-4 w-4 mr-2" />
                    Share All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ItineraryList role="traveler" />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ConversationalAgent role="traveler" />
            </div>
          </div>
        </div>

        {/* Additional Quick Actions */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
              <CardDescription className="text-gray-600">Frequently used travel tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300">
                  <Search className="h-5 w-5" />
                  <span className="text-xs">Search Destinations</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-2 hover:bg-green-50 hover:border-green-300">
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Plan New Trip</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300">
                  <Edit className="h-5 w-5" />
                  <span className="text-xs">Modify Itinerary</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-2 hover:bg-orange-50 hover:border-orange-300">
                  <Share className="h-5 w-5" />
                  <span className="text-xs">Share with Friends</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TravelerDashboard;
