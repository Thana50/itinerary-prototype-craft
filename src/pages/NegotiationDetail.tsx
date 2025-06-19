
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, DollarSign, Check, X, MessageSquare, Building2, Clock, Users } from "lucide-react";

const NegotiationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [counterOffer, setCounterOffer] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  // Mock data
  const negotiation = {
    id,
    itineraryTitle: "European Adventure",
    agency: "Globetrotter Travel",
    agentName: "Sarah Johnson",
    service: "Private Villa Rental in Tuscany",
    serviceDetails: "Luxury 3-bedroom villa with pool, daily cleaning service, and welcome basket",
    dates: "June 18 - June 22, 2025",
    nights: 4,
    travelers: 5,
    requestedPrice: 2800,
    regularPrice: 3200,
    status: "pending",
    daysToRespond: 2,
    priority: "high",
    conversation: [
      {
        sender: "agent",
        name: "Sarah Johnson",
        message: "We're looking for a luxury villa for our clients who are a family of 5. They're particularly interested in a place with a pool and good views of the countryside. Is the daily cleaning service included in your regular price?",
        timestamp: "2025-05-20T14:30:00"
      },
      {
        sender: "vendor",
        name: "Tuscan Villas",
        message: "Yes, our daily cleaning service is included. The villa also has spectacular views of the vineyards and hills. Would your clients be interested in additional services like a private chef or wine tasting at the villa?",
        timestamp: "2025-05-20T15:45:00"
      },
      {
        sender: "agent",
        name: "Sarah Johnson",
        message: "They might be interested in a private chef for one night. Could you provide pricing for that as an optional add-on? Also, I'm requesting a special rate of $2,800 for the 4-night stay given the length and season.",
        timestamp: "2025-05-21T09:20:00"
      }
    ]
  };

  const handleAccept = () => {
    setShowSuccessScreen(true);
  };

  const handleCounter = () => {
    if (!counterOffer) return;
    setShowSuccessScreen(true);
  };

  const handleDecline = () => {
    setShowSuccessScreen(true);
  };

  const handleSendMessage = () => {
    if (!message) return;
    setMessage("");
    alert("Message sent!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (showSuccessScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  Response Submitted Successfully!
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 mt-2">
                  Your negotiation response has been sent to {negotiation.agency}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-800 mb-3">What happens next?</h3>
                  <div className="space-y-2 text-green-700">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>The travel agency will review your response</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>You'll receive a notification with their decision</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>If accepted, booking details will be finalized</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-800">Expected Response</p>
                    <p className="text-lg font-bold text-blue-600">24-48 hours</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <Building2 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-purple-800">Negotiation ID</p>
                    <p className="text-lg font-bold text-purple-600">#{negotiation.id}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3 pt-6">
                <Button 
                  onClick={() => navigate("/vendor-dashboard")}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSuccessScreen(false)}
                  className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-10">
        <Button 
          variant="ghost" 
          className="mb-6 text-blue-600 hover:bg-blue-50" 
          onClick={() => navigate("/vendor-dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {negotiation.service}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      For: {negotiation.itineraryTitle}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {negotiation.priority === 'high' && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white">
                        High Priority
                      </Badge>
                    )}
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                      Awaiting Response
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Service Details</h3>
                  <p className="text-blue-700">{negotiation.serviceDetails}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Dates & Duration
                    </h3>
                    <p className="text-green-700 font-medium">{negotiation.dates}</p>
                    <p className="text-sm text-green-600">({negotiation.nights} nights)</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-purple-800 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Group Details
                    </h3>
                    <p className="text-purple-700 font-medium">{negotiation.travelers} travelers</p>
                    <p className="text-sm text-purple-600">Family group</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Regular Price</h3>
                    <p className="text-2xl font-bold flex items-center line-through text-gray-500">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {negotiation.regularPrice}
                    </p>
                    <p className="text-xs text-gray-600">Standard rate</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-orange-800 mb-2">Requested Price</h3>
                    <p className="text-2xl font-bold flex items-center text-orange-600">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {negotiation.requestedPrice}
                    </p>
                    <p className="text-xs text-orange-700 font-medium">
                      Discount: {Math.round((1 - negotiation.requestedPrice / negotiation.regularPrice) * 100)}%
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-indigo-800 mb-2">Travel Agency</h3>
                  <p className="text-indigo-700 font-medium">{negotiation.agency}</p>
                  <p className="text-sm text-indigo-600">Agent: {negotiation.agentName}</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-3 bg-gradient-to-r from-gray-50 to-slate-50">
                <Button 
                  variant="outline" 
                  onClick={handleDecline}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="mr-2 h-4 w-4" /> 
                  Decline
                </Button>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Counter Offer:</span>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <Input 
                      type="number" 
                      value={counterOffer} 
                      onChange={(e) => setCounterOffer(e.target.value)}
                      className="w-24 h-8 p-1 text-center border-blue-200 focus:border-blue-400"
                      placeholder="0000"
                    />
                  </div>
                  <Button 
                    onClick={handleCounter}
                    disabled={!counterOffer}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    Submit Counter
                  </Button>
                </div>
                <Button 
                  onClick={handleAccept}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  <Check className="mr-2 h-4 w-4" /> 
                  Accept
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Conversation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {negotiation.conversation.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col ${msg.sender === 'vendor' ? 'items-end' : 'items-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
                          msg.sender === 'vendor' 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm font-medium mb-1 opacity-90">{msg.name}</p>
                        <p className="leading-relaxed">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-3">
                  <Textarea 
                    placeholder="Type your message here..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border-blue-200 focus:border-blue-400"
                  />
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Response Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white text-sm mr-3 shadow-sm">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Request Received</p>
                      <p className="text-xs text-gray-600">May 21, 2025</p>
                    </div>
                  </div>
                  
                  <div className="w-px h-6 bg-gradient-to-b from-green-400 to-blue-400 ml-4"></div>
                  
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm mr-3 shadow-sm animate-pulse">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-blue-700">Your Response</p>
                      <p className="text-xs text-blue-600">In Progress</p>
                    </div>
                  </div>
                  
                  <div className="w-px h-6 bg-gray-200 ml-4"></div>
                  
                  <div className="flex items-center opacity-50">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm mr-3">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Final Agreement</p>
                      <p className="text-xs text-gray-400">Pending</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3 w-full">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-orange-600 mr-2" />
                    <p className="text-sm font-medium text-orange-800">
                      {negotiation.daysToRespond > 0 
                        ? `${negotiation.daysToRespond} day${negotiation.daysToRespond !== 1 ? 's' : ''} remaining` 
                        : 'Response due today'}
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationDetail;
