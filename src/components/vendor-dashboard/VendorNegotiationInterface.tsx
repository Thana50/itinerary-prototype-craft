
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lightbulb, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import SmartResponseSuggestions from "./SmartResponseSuggestions";
import ValueAddEnhancements from "./ValueAddEnhancements";
import CompetitiveIntelligence from "./CompetitiveIntelligence";

interface VendorNegotiationInterfaceProps {
  negotiation: any;
  onBack: () => void;
}

const VendorNegotiationInterface = ({ negotiation, onBack }: VendorNegotiationInterfaceProps) => {
  const [selectedResponse, setSelectedResponse] = useState("counter_165");
  const [customMessage, setCustomMessage] = useState("");
  const [depositAmount, setDepositAmount] = useState([25]);
  const [valueAdds, setValueAdds] = useState<string[]>([]);

  const responseOptions = [
    {
      id: "accept_150",
      title: "Accept Requested Rate ($150/night)",
      impact: "Low margin but excellent relationship building",
      successRate: 100,
      recommended: false
    },
    {
      id: "counter_165",
      title: "Counter Offer ($165/night)",
      impact: "Balanced profitability with high acceptance probability",
      successRate: 87,
      recommended: true
    },
    {
      id: "counter_170",
      title: "Counter Offer ($170/night)",
      impact: "Better margin but 34% chance of rejection",
      successRate: 66,
      recommended: false
    },
    {
      id: "decline",
      title: "Decline Request",
      impact: "May damage relationship with gold partner",
      successRate: 0,
      recommended: false
    }
  ];

  const handleValueAddChange = (valueAddId: string, checked: boolean) => {
    if (checked) {
      setValueAdds([...valueAdds, valueAddId]);
    } else {
      setValueAdds(valueAdds.filter(id => id !== valueAddId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Negotiation Response - {negotiation.id}</h1>
              <p className="text-gray-600">{negotiation.agency} • {negotiation.service}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Response Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Summary */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Request Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Agency</p>
                    <p className="font-medium">{negotiation.agency} <Badge variant="outline">{negotiation.partnerLevel}</Badge></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{negotiation.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dates</p>
                    <p className="font-medium">{negotiation.dates}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="font-medium">{negotiation.guests}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Market Rate:</span>
                      <span className="ml-2 font-semibold">${negotiation.marketRate}/night</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Requested:</span>
                      <span className="ml-2 font-semibold text-orange-600">${negotiation.requestedRate}/night</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SmartResponseSuggestions negotiation={negotiation} />

            {/* Response Options */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Response Options</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedResponse} onValueChange={setSelectedResponse}>
                  <div className="space-y-4">
                    {responseOptions.map((option) => (
                      <div key={option.id} className={`p-4 rounded-lg border ${option.recommended ? 'border-purple-300 bg-purple-50' : 'border-gray-200'} ${selectedResponse === option.id ? 'ring-2 ring-purple-500' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={option.id} className="font-medium text-gray-900 cursor-pointer">{option.title}</Label>
                              {option.recommended && (
                                <Badge className="bg-purple-600 text-white">RECOMMENDED</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{option.impact}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-green-600 font-medium">Success Rate: {option.successRate}%</span>
                              {option.recommended && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <ValueAddEnhancements valueAdds={valueAdds} onValueAddChange={handleValueAddChange} />

            {/* Terms Configuration */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Terms Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Deposit Requirements</Label>
                  <div className="mt-2">
                    <Slider
                      value={depositAmount}
                      onValueChange={setDepositAmount}
                      max={50}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span className="font-medium">{depositAmount[0]}%</span>
                      <span>50%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personalized Message */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Personalized Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`Dear ${negotiation.agency} team,

Thank you for choosing Phuket Beach Resort & Spa for your client's vacation. We appreciate your continued partnership and are pleased to offer special rates for this booking.

We're excited to welcome your ${negotiation.clientType} and ensure all cultural requirements are met. Our halal dining options and prayer facilities are ready for your clients. We look forward to providing an exceptional experience.

Best regards,
Reservation Manager
Phuket Beach Resort & Spa`}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                Send Response
              </Button>
              <Button variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                Save as Draft
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CompetitiveIntelligence />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorNegotiationInterface;
