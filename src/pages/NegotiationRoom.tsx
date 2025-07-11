
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Send, DollarSign, Check, X, ArrowLeft, Clock, MessageSquare } from "lucide-react";
import { negotiationService } from "@/services/negotiationService";
import { aiService } from "@/services/aiService";
import { useAuth } from "@/contexts/AuthContext";
import type { Negotiation } from "@/lib/supabase";

const NegotiationRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [priceOffer, setPriceOffer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ensure user role is valid for negotiations
  const userRole = user?.role === 'agent' || user?.role === 'vendor' ? user.role : null;

  useEffect(() => {
    if (id) {
      loadNegotiation();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [negotiation?.messages]);

  // Redirect if user doesn't have valid role for negotiations
  useEffect(() => {
    if (user && !userRole) {
      toast({
        title: "Access Denied",
        description: "Only agents and vendors can access negotiations.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, userRole, navigate]);

  const loadNegotiation = async () => {
    try {
      setIsLoading(true);
      const data = await negotiationService.getNegotiation(id!);
      setNegotiation(data);
    } catch (error) {
      console.error('Failed to load negotiation:', error);
      toast({
        title: "Error",
        description: "Failed to load negotiation details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !negotiation || !user || !userRole) return;

    try {
      const message = {
        sender_id: user.id,
        sender_role: userRole,
        message: newMessage,
        price_offer: priceOffer ? parseFloat(priceOffer) : undefined
      };

      const updatedNegotiation = await negotiationService.addMessage(negotiation.id, message);
      setNegotiation(updatedNegotiation);
      setNewMessage("");
      setPriceOffer("");

      // Get AI suggestion for response
      const aiSuggestion = await aiService.generateItineraryResponse(
        newMessage, 
        userRole === 'agent' ? 'vendor' : 'agent'
      );
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAcceptOffer = async () => {
    if (!negotiation || !user || !userRole) return;

    try {
      await negotiationService.addMessage(negotiation.id, {
        sender_id: user.id,
        sender_role: userRole,
        message: "Offer accepted! Proceeding with booking."
      });

      toast({
        title: "Success",
        description: "Offer accepted! Booking process initiated.",
      });

      // Navigate based on user role
      navigate(userRole === 'agent' ? '/agent-dashboard' : '/vendor-dashboard');

    } catch (error) {
      console.error('Failed to accept offer:', error);
    }
  };

  const handleBackNavigation = () => {
    if (userRole === 'vendor') {
      navigate('/vendor-dashboard');
    } else {
      navigate('/agent-dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading negotiation...</p>
        </div>
      </div>
    );
  }

  if (!negotiation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Negotiation Not Found</h1>
          <Button onClick={handleBackNavigation} className="bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackNavigation}
              className="mr-4 text-blue-600 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {negotiation.service_type} Negotiation
              </h1>
              <p className="text-sm text-gray-600">{negotiation.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              Active negotiation
            </div>
            <Badge 
              variant={negotiation.status === 'pending' ? 'secondary' : 'default'}
              className={negotiation.status === 'pending' 
                ? 'bg-orange-100 text-orange-800 border-orange-200' 
                : 'bg-green-100 text-green-800 border-green-200'
              }
            >
              {negotiation.status}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <DollarSign className="mr-2 h-6 w-6 text-blue-600" />
              Rate Negotiation Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="space-y-4 mb-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-blue-100" 
              style={{ height: '400px', overflowY: 'auto' }}
            >
              {negotiation?.messages && negotiation.messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-lg p-4 shadow-sm ${
                      message.sender_id === user?.id
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                        : "bg-gradient-to-r from-white to-gray-50 text-gray-800 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className={`text-xs font-medium ${
                        message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-600'
                      }`}>
                        {message.sender_role === 'agent' ? 'Travel Agent' : 'Vendor'}
                      </span>
                      <span className={`text-xs ml-auto ${
                        message.sender_id === user?.id ? 'text-blue-100 opacity-70' : 'text-gray-500'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    {message.price_offer && (
                      <div className={`mt-3 p-3 rounded-lg text-sm font-medium ${
                        message.sender_id === user?.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        Price Offer: ${message.price_offer}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 border-blue-200 focus:border-blue-400"
                />
                <Input
                  placeholder="Price ($)"
                  type="number"
                  value={priceOffer}
                  onChange={(e) => setPriceOffer(e.target.value)}
                  className="w-32 border-blue-200 focus:border-blue-400"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {userRole === 'agent' && (
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={handleAcceptOffer} 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept & Book
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Counter Offer
                  </Button>
                </div>
              )}

              {userRole === 'vendor' && (
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={handleAcceptOffer} 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept Rate
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Counter
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NegotiationRoom;
