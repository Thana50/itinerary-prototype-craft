
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, CheckCircle, AlertTriangle, TrendingUp, Clock, DollarSign } from "lucide-react";

interface ProviderResponseSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  negotiation: any;
  onResponseSubmit: (response: any) => void;
}

const ProviderResponseSimulator = ({ isOpen, onClose, negotiation, onResponseSubmit }: ProviderResponseSimulatorProps) => {
  const [responseType, setResponseType] = useState("Counter Offer");
  const [newRate, setNewRate] = useState(170);
  const [terms, setTerms] = useState("");
  const [message, setMessage] = useState("");
  const [responseTime, setResponseTime] = useState("6 hours");

  const responseTypes = [
    "Accept Target Rate",
    "Counter Offer", 
    "Reject - Too Low",
    "Request More Information",
    "Conditional Acceptance"
  ];

  const sampleResponses = {
    "Counter Offer": {
      rate: 170,
      terms: "Includes breakfast, transfers, halal dining, 50% deposit required",
      message: `Thank you for your inquiry. We appreciate your interest in our property. For the dates March 15-22, our best group rate for 2 Superior Ocean View rooms is $170/night (down from our standard $180/night).

This rate includes:
- Complimentary breakfast for all guests
- Airport transfers (one way)
- Access to halal dining options at our restaurant
- Prayer mats and Qibla direction in rooms

We require a 50% deposit within 7 days to secure this rate. The remaining balance due at check-in.

We look forward to welcoming your clients.

Best regards,
Reservation Manager
${negotiation?.provider || "Phuket Beach Resort & Spa"}`
    },
    "Accept Target Rate": {
      rate: negotiation?.targetRate || 150,
      terms: "Standard terms apply",
      message: `We are pleased to accept your rate proposal of $${negotiation?.targetRate || 150}/night for the dates requested. This is a special rate for your valued group booking.

We confirm all cultural requirements can be accommodated.

Best regards,
Reservation Manager`
    },
    "Reject - Too Low": {
      rate: negotiation?.originalRate || 180,
      terms: "No flexibility on rate",
      message: `Thank you for your inquiry. Unfortunately, we cannot accommodate the requested rate as it falls below our operational costs. Our best available rate remains $${negotiation?.originalRate || 180}/night.

We hope you understand and look forward to future opportunities.`
    }
  };

  const handleResponseTypeChange = (type: string) => {
    setResponseType(type);
    const sample = sampleResponses[type as keyof typeof sampleResponses];
    if (sample) {
      setNewRate(sample.rate);
      setTerms(sample.terms);
      setMessage(sample.message);
    }
  };

  const handleSubmit = () => {
    const response = {
      type: responseType,
      rate: newRate,
      terms,
      message,
      responseTime,
      timestamp: new Date().toISOString()
    };
    onResponseSubmit(response);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-purple-900">
            Provider Response Simulator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provider">Provider Name</Label>
              <Input 
                id="provider" 
                value={negotiation?.provider || ""} 
                disabled 
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="responseType">Response Type</Label>
              <select 
                id="responseType"
                value={responseType}
                onChange={(e) => handleResponseTypeChange(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {responseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newRate">New Rate Offered ($)</Label>
              <Input 
                id="newRate"
                type="number"
                value={newRate}
                onChange={(e) => setNewRate(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="responseTime">Response Time</Label>
              <select 
                id="responseTime"
                value={responseTime}
                onChange={(e) => setResponseTime(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="Immediate">Immediate</option>
                <option value="2 hours">2 hours</option>
                <option value="6 hours">6 hours</option>
                <option value="24 hours">24 hours</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea 
              id="terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Additional terms and conditions..."
              className="h-20"
            />
          </div>

          <div>
            <Label htmlFor="message">Provider Message</Label>
            <Textarea 
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provider's response message..."
              className="h-40"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Submit Response
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderResponseSimulator;
