
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Send, DollarSign, Check, X } from "lucide-react";
import { negotiationService } from "@/services/negotiationService";
import { aiService } from "@/services/aiService";
import { authService } from "@/services/authService";
import type { Negotiation } from "@/lib/supabase";

const NegotiationRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [priceOffer, setPriceOffer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
    if (id) {
      loadNegotiation();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [negotiation?.messages]);

  const checkAuth = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (!userData) {
        navigate("/login");
        return;
      }
      setCurrentUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate("/login");
    }
  };

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
    if (!newMessage.trim() || !negotiation || !currentUser) return;

    try {
      const message = {
        sender_id: currentUser.user.id,
        sender_role: currentUser.profile.role,
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
        currentUser.profile.role === 'agent' ? 'vendor' : 'agent'
      );
      
      toast({
        title: "AI Suggestion",
        description: aiSuggestion,
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
    if (!negotiation) return;

    try {
      await negotiationService.addMessage(negotiation.id, {
        sender_id: currentUser.user.id,
        sender_role: currentUser.profile.role,
        message: "Offer accepted! Proceeding with booking."
      });

      toast({
        title: "Success",
        description: "Offer accepted! Booking process initiated.",
      });

      // In a real app, this would trigger booking workflow
      navigate(currentUser.profile.role === 'agent' ? '/agent-dashboard' : '/vendor-dashboard');

    } catch (error) {
      console.error('Failed to accept offer:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading negotiation...</p>
        </div>
      </div>
    );
  }

  if (!negotiation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Negotiation Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{negotiation.service_type} Negotiation</h1>
            <p className="text-sm text-gray-600">{negotiation.description}</p>
          </div>
          <Badge variant={negotiation.status === 'pending' ? 'secondary' : 'default'}>
            {negotiation.status}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Rate Negotiation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6" style={{ height: '400px', overflowY: 'auto' }}>
              {negotiation.messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender_id === currentUser?.user.id ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender_id === currentUser?.user.id
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="text-xs font-medium">
                        {message.sender_role === 'agent' ? 'Travel Agent' : 'Vendor'}
                      </span>
                      <span className="text-xs ml-auto opacity-70">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    {message.price_offer && (
                      <div className="mt-2 p-2 bg-white/20 rounded text-sm font-medium">
                        Price Offer: ${message.price_offer}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Input
                  placeholder="Price ($)"
                  type="number"
                  value={priceOffer}
                  onChange={(e) => setPriceOffer(e.target.value)}
                  className="w-32"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {currentUser?.profile.role === 'agent' && (
                <div className="flex gap-2">
                  <Button onClick={handleAcceptOffer} className="bg-green-600 hover:bg-green-700">
                    <Check className="mr-2 h-4 w-4" />
                    Accept & Book
                  </Button>
                  <Button variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Counter Offer
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
