import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, Users, MessageSquare, Send, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { negotiationService } from "@/services/negotiationService";
import type { Negotiation } from "@/lib/supabase";

interface NegotiationRequestCardProps {
  negotiation: Negotiation;
  onResponse: () => void;
}

const NegotiationRequestCard = ({ negotiation, onResponse }: NegotiationRequestCardProps) => {
  const { toast } = useToast();
  const [isResponding, setIsResponding] = useState(false);
  const [responseData, setResponseData] = useState({
    counterOffer: negotiation.target_price || 0,
    message: '',
    action: '' as 'accept' | 'counter' | 'reject'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = async (action: 'accept' | 'counter' | 'reject') => {
    setIsSubmitting(true);
    try {
      let message = responseData.message;
      let priceOffer = undefined;

      if (action === 'accept') {
        message = message || `Thank you for your inquiry! We're pleased to accept your request for ${negotiation.description} at $${negotiation.target_price}.`;
        priceOffer = negotiation.target_price || 0;
      } else if (action === 'counter') {
        message = message || `Thank you for your interest in ${negotiation.description}. We can offer this service at $${responseData.counterOffer}.`;
        priceOffer = responseData.counterOffer;
      } else {
        message = message || `Thank you for your inquiry. Unfortunately, we cannot accommodate this request at this time.`;
      }

      // Add message to negotiation
      await negotiationService.addMessage(negotiation.id, {
        sender_id: negotiation.vendor_id,
        sender_role: 'vendor',
        message,
        price_offer: priceOffer
      });

      // Update negotiation status
      const newStatus = action === 'accept' ? 'accepted' : 
                       action === 'reject' ? 'rejected' : 'negotiating';
      
      await negotiationService.updateNegotiation(negotiation.id, {
        status: newStatus,
        final_price: action === 'accept' ? negotiation.target_price : undefined
      });

      toast({
        title: "Response Sent!",
        description: `Your ${action} response has been sent to the agent.`,
      });

      setIsResponding(false);
      onResponse();
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'negotiating': return 'bg-blue-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatServiceType = (type: string) => {
    const typeMap: Record<string, string> = {
      'accommodation': 'Hotel/Resort',
      'tours': 'Tour & Activities',
      'transportation': 'Transportation',
      'dining': 'Dining',
      'activities': 'Activities'
    };
    return typeMap[type] || type;
  };

  if (negotiation.status === 'accepted' || negotiation.status === 'rejected') {
    return (
      <Card className="border-l-4 border-l-gray-400">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{negotiation.description}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {formatServiceType(negotiation.service_type)} • 
                Request from Agent {negotiation.agent_id.slice(-8)}
              </p>
            </div>
            <Badge className={`${getStatusColor(negotiation.status)} text-white`}>
              {negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            <p>Original Request: ${negotiation.original_price}</p>
            <p>Target Price: ${negotiation.target_price}</p>
            {negotiation.final_price && (
              <p className="font-semibold">Final Price: ${negotiation.final_price}</p>
            )}
            <p className="mt-2">Completed on {new Date(negotiation.updated_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-orange-400">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{negotiation.description}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {formatServiceType(negotiation.service_type)} • 
              Request from Agent {negotiation.agent_id.slice(-8)}
            </p>
          </div>
          <Badge className={`${getStatusColor(negotiation.status)} text-white`}>
            {negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Request Details */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>Original: ${negotiation.original_price}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span>Target: ${negotiation.target_price}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span>Priority: {negotiation.negotiation_priority || 'Medium'}</span>
          </div>
        </div>

        {/* Messages */}
        {negotiation.messages && negotiation.messages.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Latest Message:</h4>
            <p className="text-sm">{negotiation.messages[negotiation.messages.length - 1].message}</p>
          </div>
        )}

        {/* Response Interface */}
        {!isResponding ? (
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setResponseData(prev => ({ ...prev, action: 'accept' }));
                setIsResponding(true);
              }}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button 
              onClick={() => {
                setResponseData(prev => ({ ...prev, action: 'counter' }));
                setIsResponding(true);
              }}
              variant="outline"
              size="sm"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Counter Offer
            </Button>
            <Button 
              onClick={() => {
                setResponseData(prev => ({ ...prev, action: 'reject' }));
                setIsResponding(true);
              }}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              size="sm"
            >
              <X className="h-4 w-4 mr-1" />
              Decline
            </Button>
          </div>
        ) : (
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-semibold">
              {responseData.action === 'accept' ? 'Accept Request' :
               responseData.action === 'counter' ? 'Send Counter Offer' : 'Decline Request'}
            </h4>
            
            {responseData.action === 'counter' && (
              <div>
                <label className="block text-sm font-medium mb-1">Counter Offer Price</label>
                <Input
                  type="number"
                  value={responseData.counterOffer}
                  onChange={(e) => setResponseData(prev => ({ 
                    ...prev, 
                    counterOffer: Number(e.target.value) 
                  }))}
                  placeholder="Enter your counter offer"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Message (Optional)</label>
              <Textarea
                value={responseData.message}
                onChange={(e) => setResponseData(prev => ({ 
                  ...prev, 
                  message: e.target.value 
                }))}
                placeholder="Add a custom message..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => handleResponse(responseData.action)}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Send className="h-4 w-4 mr-1" />
                {isSubmitting ? 'Sending...' : 'Send Response'}
              </Button>
              <Button
                onClick={() => setIsResponding(false)}
                variant="outline"
                size="sm"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NegotiationRequestCard;