
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LogOut, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ConversationalAgent from "@/components/ConversationalAgent";

const CreateItinerary = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    itineraryName: "",
    destination: "",
    startDate: "",
    endDate: "",
    numberOfTravelers: "",
    clientPreferences: ""
  });

  const [chatMessage, setChatMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Details Saved",
      description: "Trip overview details have been saved successfully.",
    });
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    // This would integrate with the ConversationalAgent
    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/ef555a68-c6d2-42b5-a2c1-a1469ea4d143.png" 
              alt="Travia Logo" 
              className="h-12 w-auto mr-4"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, Agent!</span>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Itinerary Builder</h1>
          <Button variant="ghost" onClick={() => navigate("/agent-dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trip Overview Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trip Overview</CardTitle>
                <CardDescription className="text-gray-500">
                  (We'll fill this out as we chat!)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSaveUpdate}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="itineraryName" className="text-sm font-medium text-gray-700">
                        Itinerary Name
                      </Label>
                      <Input 
                        id="itineraryName"
                        name="itineraryName"
                        placeholder="e.g., Paris Adventure (AI can suggest this)"
                        value={formData.itineraryName}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
                        Destination
                      </Label>
                      <Input 
                        id="destination"
                        name="destination"
                        placeholder="e.g., Paris, France (Tell AI first)"
                        value={formData.destination}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                          Start Date
                        </Label>
                        <Input 
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                          End Date
                        </Label>
                        <Input 
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="numberOfTravelers" className="text-sm font-medium text-gray-700">
                        Number of Travelers
                      </Label>
                      <Input 
                        id="numberOfTravelers"
                        name="numberOfTravelers"
                        placeholder="e.g., 2"
                        value={formData.numberOfTravelers}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="clientPreferences" className="text-sm font-medium text-gray-700">
                        Client Preferences / Notes
                      </Label>
                      <Textarea 
                        id="clientPreferences"
                        name="clientPreferences"
                        placeholder="e.g., Luxury hotels, historical sites, dietary needs (AI will ask for this)"
                        value={formData.clientPreferences}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Save/Update Details
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Generated Itinerary Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated Itinerary Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  <p>Itinerary details will appear here as you build it with AI assistance...</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Assistant */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader className="bg-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-6 h-6 bg-white rounded mr-2 flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  </div>
                  Travia AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="bg-blue-100 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    Hello! I'm your Travia AI Assistant. To get started, please tell me about the trip you'd like to plan (e.g., "A 7-day luxury trip to Paris for 2 people").
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="h-64 bg-gray-50 rounded-lg p-4 overflow-y-auto">
                    {/* Chat messages would appear here */}
                    <div className="text-center text-gray-500 text-sm">
                      Start chatting to build your itinerary...
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Describe the trip you want to plan..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          © 2025 Travia. Where Custom Trips Click.
        </footer>
      </div>
    </div>
  );
};

export default CreateItinerary;
