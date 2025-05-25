import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LogOut, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface TripDetails {
  itineraryName?: string;
  destination?: string;
  numberOfTravelers?: string;
  duration?: string;
  clientPreferences?: string;
}

const CreateItinerary = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    itineraryName: "",
    destination: "",
    startDate: "",
    endDate: "",
    numberOfTravelers: "",
    clientPreferences: ""
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hello! I'm your Travia AI Assistant for Southeast Asian travel planning. I specialize in Thailand, Singapore, Malaysia, Indonesia, Philippines, and Vietnam - perfect for Middle Eastern travelers! Try saying: 'Create a 7-day trip to Phuket called Paradise Beach for 4 people'",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const parseTripDetails = (input: string): TripDetails => {
    const lowercaseInput = input.toLowerCase();
    const details: TripDetails = {};

    // Extract trip name (after "called" or "named")
    const nameMatch = input.match(/(?:called|named)\s+["']?([^"']+?)["']?(?:\s|$|for|to)/i);
    if (nameMatch) {
      details.itineraryName = nameMatch[1].trim();
    }

    // Extract destinations
    const destinations = {
      phuket: "Phuket, Thailand",
      bangkok: "Bangkok, Thailand", 
      singapore: "Singapore",
      bali: "Bali, Indonesia",
      "kuala lumpur": "Kuala Lumpur, Malaysia",
      penang: "Penang, Malaysia",
      langkawi: "Langkawi, Malaysia",
      jakarta: "Jakarta, Indonesia",
      "ho chi minh": "Ho Chi Minh City, Vietnam",
      hanoi: "Hanoi, Vietnam",
      manila: "Manila, Philippines",
      boracay: "Boracay, Philippines"
    };

    for (const [key, value] of Object.entries(destinations)) {
      if (lowercaseInput.includes(key)) {
        details.destination = value;
        break;
      }
    }

    // Extract number of travelers
    const travelersMatch = input.match(/(\d+)\s*(?:people|travelers?|persons?|pax)/i);
    if (travelersMatch) {
      details.numberOfTravelers = travelersMatch[1];
    }

    // Extract duration
    const durationMatch = input.match(/(\d+)[\s-]*(?:days?|nights?)/i);
    if (durationMatch) {
      details.duration = `${durationMatch[1]} days`;
    }

    return details;
  };

  const updateFormWithTripDetails = (details: TripDetails) => {
    setFormData(prev => ({
      ...prev,
      ...(details.itineraryName && { itineraryName: details.itineraryName }),
      ...(details.destination && { destination: details.destination }),
      ...(details.numberOfTravelers && { numberOfTravelers: details.numberOfTravelers }),
      ...(details.duration && { clientPreferences: prev.clientPreferences + (prev.clientPreferences ? ", " : "") + `Duration: ${details.duration}` })
    }));
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      text: chatInput,
      sender: "user",
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    
    // Parse trip details and update form
    const tripDetails = parseTripDetails(chatInput);
    if (Object.keys(tripDetails).length > 0) {
      updateFormWithTripDetails(tripDetails);
    }

    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Date.now() + 1,
        text: getAIResponse(chatInput, tripDetails),
        sender: "ai",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (input: string, parsedDetails: TripDetails) => {
    const lowercaseInput = input.toLowerCase();
    
    // Special response for the example case
    if (lowercaseInput.includes("phuket") && lowercaseInput.includes("paradise beach") && lowercaseInput.includes("4 people") && lowercaseInput.includes("7")) {
      return "Perfect! I've created 'Paradise Beach' - your Phuket adventure! Thailand is excellent for Middle Eastern families with abundant halal food options, beautiful beaches, and rich culture.";
    }
    
    // Generic response when trip details are detected
    if (Object.keys(parsedDetails).length > 0) {
      let response = "Great! I've extracted the trip details and updated your form. ";
      
      if (parsedDetails.itineraryName && parsedDetails.destination) {
        response += `Your '${parsedDetails.itineraryName}' trip to ${parsedDetails.destination} looks amazing! `;
      } else if (parsedDetails.destination) {
        response += `${parsedDetails.destination} is an excellent choice! `;
      }
      
      if (parsedDetails.destination?.includes("Thailand")) {
        response += "Thailand offers incredible experiences with halal dining, beautiful beaches, and rich culture. ";
      } else if (parsedDetails.destination?.includes("Singapore")) {
        response += "Singapore is perfect for Middle Eastern travelers with excellent halal food and modern attractions. ";
      } else if (parsedDetails.destination?.includes("Malaysia")) {
        response += "Malaysia is ideal for Muslim travelers with abundant halal options and diverse experiences. ";
      } else if (parsedDetails.destination?.includes("Indonesia")) {
        response += "Indonesia offers amazing cultural experiences and beautiful landscapes. ";
      }
      
      response += "What specific activities or preferences would you like me to include?";
      return response;
    }
    
    // Existing response logic for other cases
    if (lowercaseInput.includes("phuket")) {
      return "Perfect choice! Phuket is ideal for Middle Eastern travelers. I'll create a luxury itinerary featuring pristine beaches, halal dining, cultural experiences, and world-class spas. Would you like me to include specific activities like island hopping to Phi Phi Islands or traditional Thai cooking classes?";
    } else if (lowercaseInput.includes("singapore")) {
      return "Singapore is excellent for Middle Eastern visitors! It's a Muslim-friendly destination with halal food everywhere, stunning architecture, and amazing shopping. What type of experience are you looking for - luxury, family-friendly, or cultural exploration?";
    } else if (lowercaseInput.includes("thailand")) {
      return "Thailand offers incredible experiences for Middle Eastern travelers! From Bangkok's vibrant culture to Phuket's beaches and Chiang Mai's temples. What cities or experiences interest your clients most?";
    } else if (lowercaseInput.includes("malaysia")) {
      return "Malaysia is perfect for Middle Eastern travelers - it's a Muslim-majority country with incredible diversity! Kuala Lumpur's modern skyline, Penang's heritage, and Langkawi's beaches. What aspects would you like to highlight?";
    } else if (lowercaseInput.includes("indonesia")) {
      return "Indonesia, especially Bali and Jakarta, offers amazing experiences! Bali has Hindu culture with Muslim-friendly accommodations, while Jakarta showcases modern Indonesia. What type of Indonesian adventure are you planning?";
    } else if (lowercaseInput.includes("create") || lowercaseInput.includes("itinerary")) {
      return "I'd love to help create an amazing Southeast Asian itinerary! Please tell me: Which country/countries? How many days? How many travelers? What's their budget range and interests?";
    } else {
      return "I'm here to help you create amazing Southeast Asian travel experiences! Feel free to ask about destinations, activities, cultural considerations, or specific itinerary requests for Thailand, Singapore, Malaysia, Indonesia, Philippines, or Vietnam.";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
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
                        placeholder="e.g., Paradise Beach Adventure"
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
                        placeholder="e.g., Phuket, Thailand"
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
                        placeholder="e.g., 4"
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
                        placeholder="e.g., Luxury hotels, halal dining, cultural experiences"
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

          {/* Right Column - AI Chat Interface */}
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
              <CardContent className="p-0">
                {/* Chat Messages Area */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user" 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Chat Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Describe the trip you want to plan..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleKeyPress}
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
