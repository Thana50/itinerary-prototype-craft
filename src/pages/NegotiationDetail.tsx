
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, DollarSign, Check, X, MessageSquare } from "lucide-react";

const NegotiationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [counterOffer, setCounterOffer] = useState<string>("");
  const [message, setMessage] = useState<string>("");

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
    // In a real app, you would make an API call here
    alert("Offer accepted!");
    navigate("/vendor-dashboard");
  };

  const handleCounter = () => {
    if (!counterOffer) return;
    // In a real app, you would make an API call here
    alert(`Counter offer of $${counterOffer} submitted!`);
    navigate("/vendor-dashboard");
  };

  const handleDecline = () => {
    // In a real app, you would make an API call here
    alert("Offer declined");
    navigate("/vendor-dashboard");
  };

  const handleSendMessage = () => {
    if (!message) return;
    // In a real app, you would make an API call here
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

  return (
    <div className="container mx-auto px-4 py-10">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{negotiation.service}</CardTitle>
                  <CardDescription>For: {negotiation.itineraryTitle}</CardDescription>
                </div>
                <Badge variant="secondary">Awaiting Response</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Service Details</h3>
                <p>{negotiation.serviceDetails}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Dates</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {negotiation.dates} ({negotiation.nights} nights)
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Group Size</h3>
                  <p>{negotiation.travelers} travelers</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Regular Price</h3>
                  <p className="text-lg font-medium flex items-center line-through text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {negotiation.regularPrice}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Requested Price</h3>
                  <p className="text-xl font-bold flex items-center">
                    <DollarSign className="h-5 w-5 mr-1" />
                    {negotiation.requestedPrice}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Discount: {Math.round((1 - negotiation.requestedPrice / negotiation.regularPrice) * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Travel Agency</h3>
                <p>{negotiation.agency} ({negotiation.agentName})</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleDecline}>
                <X className="mr-2 h-4 w-4" /> Decline
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleCounter}>
                Counter Offer: $
                <Input 
                  type="number" 
                  value={counterOffer} 
                  onChange={(e) => setCounterOffer(e.target.value)}
                  className="w-24 mx-1 h-8 p-1 text-center"
                />
              </Button>
              <Button onClick={handleAccept}>
                <Check className="mr-2 h-4 w-4" /> Accept
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {negotiation.conversation.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col ${msg.sender === 'vendor' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'vendor' 
                          ? 'bg-primary/10 text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm font-medium">{msg.name}</p>
                      <p>{msg.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-2">
                <Textarea 
                  placeholder="Type your message here..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full"
                />
                <Button 
                  className="w-full" 
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
          <Card>
            <CardHeader>
              <CardTitle>Response Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm mr-3">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Request Received</p>
                    <p className="text-xs text-muted-foreground">May 21, 2025</p>
                  </div>
                </div>
                
                <div className="w-px h-6 bg-border ml-4"></div>
                
                <div className="flex items-center opacity-70">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm mr-3">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Your Response</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
                
                <div className="w-px h-6 bg-border ml-4 opacity-70"></div>
                
                <div className="flex items-center opacity-70">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm mr-3">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Final Agreement</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {negotiation.daysToRespond > 0 
                  ? `Please respond within ${negotiation.daysToRespond} day${negotiation.daysToRespond !== 1 ? 's' : ''}` 
                  : 'Response is due today'}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NegotiationDetail;
