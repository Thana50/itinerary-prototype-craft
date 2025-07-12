
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  MessageCircle, 
  Heart,
  Share2,
  Download,
  Edit3,
  CheckCircle,
  AlertCircle,
  Star,
  Camera,
  Navigation
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedClientPortalProps {
  itinerary: any;
  onUpdatePreferences?: (preferences: any) => void;
  onAddComment?: (comment: string, dayIndex: number, itemIndex: number) => void;
}

const EnhancedClientPortal = ({ 
  itinerary, 
  onUpdatePreferences, 
  onAddComment 
}: EnhancedClientPortalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [preferences, setPreferences] = useState(itinerary?.preferences || "");
  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);

  const handleSavePreferences = () => {
    if (onUpdatePreferences) {
      onUpdatePreferences(preferences);
      toast({
        title: "Preferences Updated",
        description: "Your travel preferences have been saved successfully.",
      });
    }
    setIsEditingPreferences(false);
  };

  const toggleFavorite = (itemId: string) => {
    setFavoriteItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleShareItinerary = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Itinerary link has been copied to your clipboard.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'negotiating': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{itinerary?.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{itinerary?.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{itinerary?.start_date} - {itinerary?.end_date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{itinerary?.number_of_travelers} travelers</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleShareItinerary}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Trip Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-green-700">Confirmed Bookings</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-yellow-700">Pending Approval</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-blue-700">In Negotiation</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-purple-700">Trip Completion</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="itinerary">Day by Day</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="updates">Live Updates</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Phi Phi Island Tour', 'Thai Cooking Class', 'Elephant Sanctuary Visit', 'Sunset Dinner Cruise'].map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">{highlight}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(highlight)}
                        className="ml-auto"
                      >
                        <Heart className={`h-4 w-4 ${favoriteItems.includes(highlight) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weather & Local Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Weather Forecast</h4>
                    <p className="text-blue-700">Sunny skies, 28-32°C. Perfect beach weather!</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Local Tips</h4>
                    <p className="text-green-700">Best time for street food is after 6 PM. Carry sunscreen and water.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="itinerary" className="space-y-4">
          <div className="space-y-6">
            {itinerary?.days?.map((day: any, dayIndex: number) => (
              <Card key={dayIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Day {dayIndex + 1} - {day.date}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {day.activities?.map((activity: any, actIndex: number) => (
                      <div key={actIndex} className="border-l-4 border-purple-300 pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{activity.name}</h4>
                              <Badge className={`${getStatusColor(activity.status)} text-white`}>
                                {activity.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(`${dayIndex}-${actIndex}`)}
                              >
                                <Heart className={`h-4 w-4 ${favoriteItems.includes(`${dayIndex}-${actIndex}`) ? 'fill-red-500 text-red-500' : ''}`} />
                              </Button>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {activity.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {activity.location}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{activity.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Navigation className="h-4 w-4 mr-2" />
                            Get Directions
                          </Button>
                          <Button variant="outline" size="sm">
                            <Camera className="h-4 w-4 mr-2" />
                            Add Photos
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Add Note
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Travel Preferences
                <Button
                  variant={isEditingPreferences ? "default" : "outline"}
                  size="sm"
                  onClick={() => isEditingPreferences ? handleSavePreferences() : setIsEditingPreferences(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditingPreferences ? "Save" : "Edit"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingPreferences ? (
                <textarea
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={6}
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="Share your travel preferences, dietary requirements, accessibility needs, or any special requests..."
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    {preferences || "No preferences specified yet. Click Edit to add your preferences."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "2 hours ago", message: "Hotel booking confirmed for Marriott Phuket", type: "success" },
                  { time: "4 hours ago", message: "Thai cooking class negotiation in progress", type: "pending" },
                  { time: "1 day ago", message: "Flight details updated - departure time changed", type: "info" },
                  { time: "2 days ago", message: "Tour guide assigned for island hopping", type: "success" }
                ].map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      update.type === 'success' ? 'bg-green-500' : 
                      update.type === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{update.message}</p>
                      <p className="text-sm text-gray-500">{update.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages with Your Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {[
                  { sender: "agent", message: "Hi! Your itinerary is looking great. The hotel bookings are confirmed!", time: "10:30 AM" },
                  { sender: "client", message: "Wonderful! Quick question about the cooking class - is it suitable for beginners?", time: "10:32 AM" },
                  { sender: "agent", message: "Absolutely! The chef is very patient with beginners. You'll love it!", time: "10:35 AM" }
                ].map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === 'client' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p>{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'client' ? 'text-blue-100' : 'text-gray-500'
                      }`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg"
                />
                <Button>Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedClientPortal;
