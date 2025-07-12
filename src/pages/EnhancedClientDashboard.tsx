
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import EnhancedClientPortal from "@/components/client-experience/EnhancedClientPortal";
import RealTimeUpdates from "@/components/client-experience/RealTimeUpdates";
import ClientFeedbackSystem from "@/components/client-experience/ClientFeedbackSystem";

const EnhancedClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState("dashboard");

  // Mock itinerary data
  const mockItinerary = {
    id: "itin-001",
    name: "Amazing Thailand Adventure",
    destination: "Phuket, Thailand",
    start_date: "March 15, 2025",
    end_date: "March 22, 2025",
    number_of_travelers: 2,
    preferences: "We love adventure activities and authentic local food. Prefer beachfront accommodations.",
    days: [
      {
        date: "March 15, 2025",
        activities: [
          {
            name: "Airport Transfer & Hotel Check-in",
            time: "2:00 PM",
            location: "Marriott Resort Phuket",
            description: "Private transfer from airport to hotel",
            status: "confirmed"
          },
          {
            name: "Welcome Dinner",
            time: "7:00 PM",
            location: "Beachfront Restaurant",
            description: "Traditional Thai cuisine with ocean view",
            status: "confirmed"
          }
        ]
      },
      {
        date: "March 16, 2025",
        activities: [
          {
            name: "Phi Phi Islands Tour",
            time: "8:00 AM",
            location: "Phi Phi Islands",
            description: "Full day island hopping with snorkeling",
            status: "confirmed"
          }
        ]
      }
    ]
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const handleUpdatePreferences = (preferences: string) => {
    console.log("Updated preferences:", preferences);
    // Here you would typically save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0eec4e7f-1447-475b-928f-96fbc0eca6e8.png" 
              alt="Travia Logo" 
              className="h-12 w-auto mr-4"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Travel Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Traveler'}!</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              My Itinerary
            </TabsTrigger>
            <TabsTrigger value="updates" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Live Updates
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Experience Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <EnhancedClientPortal 
              itinerary={mockItinerary}
              onUpdatePreferences={handleUpdatePreferences}
            />
          </TabsContent>

          <TabsContent value="updates">
            <RealTimeUpdates itineraryId={mockItinerary.id} />
          </TabsContent>

          <TabsContent value="feedback">
            <ClientFeedbackSystem itineraryId={mockItinerary.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedClientDashboard;
