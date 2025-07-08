import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Search, Edit, Share, LogOut } from "lucide-react";
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
            <span className="text-gray-600">Welcome, {user?.name || 'Traveler'}!</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Traveler Dashboard</h1>
          <p className="text-muted-foreground">Review and modify your travel itineraries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Trip</CardTitle>
              <CardDescription>European Adventure</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>June 15 - June 30, 2025</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Itinerary Status</CardTitle>
              <CardDescription>Waiting for your feedback</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center">
              <Edit className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>2 modifications requested</span>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Itineraries</CardTitle>
                <CardDescription>Review and modify your travel plans</CardDescription>
              </CardHeader>
              <CardContent>
                <ItineraryList role="traveler" />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <ConversationalAgent role="traveler" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelerDashboard;
