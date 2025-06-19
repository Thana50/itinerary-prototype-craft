
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
      terms: "Standard terms apply, breakfast included",
      message: `We are pleased to accept your rate proposal of $${negotiation?.targetRate || 150}/night for the dates requested. This is a special rate for your valued group booking.

This rate includes:
- Daily breakfast for all guests
- Access to halal dining options
- Cultural accommodation for Middle Eastern guests

We confirm all cultural requirements can be accommodated. A 25% deposit will secure this booking.

Best regards,
Reservation Manager`
    },
    "Reject - Too Low": {
      rate: negotiation?.originalRate || 180,
      terms: "No flexibility on rate, standard terms",
      message: `Thank you for your inquiry. Unfortunately, we cannot accommodate the requested rate of $${negotiation?.targetRate || 150}/night as it falls below our operational costs during this period.

Our best available rate remains $${negotiation?.originalRate || 180}/night, which includes:
- Daily breakfast
- Airport transfers
- Cultural amenities

We hope you understand and look forward to future opportunities when our rates might better align with your budget.

Best regards,
Reservation Manager`
    },
    "Request More Information": {
      rate: 0,
      terms: "Pending additional details",
      message: `Thank you for your group booking inquiry. To provide you with our best possible rate, we need some additional information:

1. Exact number of adults and children
2. Specific dietary requirements for halal meals
3. Preferred room configuration (twin beds vs king)
4. Any special occasion or celebration details
5. Flexibility with check-in/check-out dates

Once we have these details, we can provide a customized group rate that meets your clients' needs.

Best regards,
Reservation Manager`
    },
    "Conditional Acceptance": {
      rate: 160,
      terms: "Conditional on 7-night minimum, 30% deposit",
      message: `We are pleased to offer a special group rate of $160/night for your clients, subject to the following conditions:

Conditions:
- Minimum 7-night stay (confirmed)
- Booking must be confirmed within 48 hours
- 30% deposit required within 5 days
- Non-refundable after 14 days prior to arrival

This rate includes:
- Daily breakfast
- One-way airport transfers
- Access to halal dining
- Cultural amenities

We believe this represents excellent value for your Middle Eastern clientele.

Best regards,
Reservation Manager`
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

  const getAIInsights = () => {
    const variance = newRate - (negotiation?.targetRate || 150);
    const percentage = ((variance / (negotiation?.targetRate || 150)) * 100).toFixed(1);
    
    return {
      variance,
      percentage,
      marketComparison: variance > 0 ? "6% above average market rate" : "3% below average market rate",
      assessment: Math.abs(variance) <= 15 ? "REASONABLE" : Math.abs(variance) <= 25 ? "HIGH" : "EXCESSIVE"
    };
  };

  const handleSubmit = () => {
    const response = {
      type: responseType,
      rate: newRate,
      terms,
      message,
      responseTime,
      timestamp: new Date().toISOString(),
      aiInsights: getAIInsights()
    };
    onResponseSubmit(response);
  };

  const insights = getAIInsights();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-purple-900 flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Provider Response Simulator
          </DialogTitle>
          <p className="text-sm text-gray-600">Simulate provider responses to test AI analysis and recommendation engine</p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Response Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Provider Response Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </div>

          {/* AI Preview Analysis - Right Side */}
          <div className="space-y-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm text-blue-900 flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Analysis Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Rate Variance:</span>
                  <Badge className={`text-xs ${Math.abs(insights.variance) <= 15 ? 'bg-green-500' : Math.abs(insights.variance) <= 25 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                    ${Math.abs(insights.variance)} ({insights.percentage}%)
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Assessment:</span>
                  <span className="text-xs font-medium text-blue-900">{insights.assessment}</span>
                </div>
                <div className="text-xs text-blue-600 italic">{insights.marketComparison}</div>
                
                <div className="pt-2 border-t border-blue-200">
                  <div className="flex items-center text-xs text-blue-700 mb-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Response Pattern
                  </div>
                  <p className="text-xs text-blue-600">This provider typically responds within {responseTime.toLowerCase()}</p>
                </div>

                <div className="pt-2 border-t border-blue-200">
                  <div className="flex items-center text-xs text-blue-700 mb-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Success Probability
                  </div>
                  <p className="text-xs text-blue-600">
                    {responseType === "Counter Offer" ? "78%" : responseType === "Accept Target Rate" ? "95%" : "45%"} chance of favorable outcome
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-sm text-purple-900">Provider Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-xs text-purple-700">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  5 previous successful negotiations
                </div>
                <div className="flex items-center text-xs text-purple-700">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Usually accepts counter-offers
                </div>
                <div className="flex items-center text-xs text-purple-700">
                  <AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" />
                  Prefers quick responses (within 6 hours)
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Submit Response & Analyze
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderResponseSimulator;
