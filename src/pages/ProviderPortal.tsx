
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Download, Phone, HelpCircle, Check } from "lucide-react";

const ProviderPortal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responseType, setResponseType] = useState("counter");
  const [counterRate, setCounterRate] = useState(170);
  const [paymentTerms, setPaymentTerms] = useState("25% deposit, balance at check-in");
  const [cancellationPolicy, setCancellationPolicy] = useState("Standard policy applies");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [includedServices, setIncludedServices] = useState({
    breakfast: true,
    transfers: true,
    welcome: false,
    checkout: false,
    upgrade: false,
    spa: false
  });

  const [culturalAccommodations, setCulturalAccommodations] = useState({
    halal: true,
    prayer: true,
    qibla: true,
    family: false,
    arabic: false
  });

  const handleServiceChange = (service: string, checked: boolean) => {
    setIncludedServices(prev => ({ ...prev, [service]: checked }));
  };

  const handleCulturalChange = (accommodation: string, checked: boolean) => {
    setCulturalAccommodations(prev => ({ ...prev, [accommodation]: checked }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-800">Response Submitted Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Thank you! Your response has been submitted successfully.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Travia will review your offer within 2 business hours</li>
              <li>• You'll receive email confirmation of their decision</li>
              <li>• Your response has been saved to your portal history</li>
            </ul>
            <p className="text-sm text-gray-500 pt-4">
              Need to modify your response? Contact us at partners@travia.com
            </p>
            <Button 
              onClick={() => window.close()} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              Close Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Travia Partner Portal - Rate Negotiation</h1>
              <p className="text-gray-600">Negotiation Request from Travia Travel</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium">LOGO</span>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                <HelpCircle className="h-4 w-4 mr-1" />
                Need Help?
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Negotiation Request #TRV-2025-001</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Submitted: March 10, 2025 at 2:30 PM</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Standard</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      48 hours left
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Client Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-500">Client Type:</span> Group Booking</div>
                      <div><span className="text-gray-500">Origin:</span> UAE</div>
                      <div><span className="text-gray-500">Profile:</span> Middle Eastern Family</div>
                      <div><span className="text-gray-500">Requirements:</span> Halal dining, prayer facilities</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Service Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-500">Service:</span> Hotel Accommodation</div>
                      <div><span className="text-gray-500">Room Type:</span> Superior Ocean View</div>
                      <div><span className="text-gray-500">Dates:</span> March 15-22, 2025 (7 nights)</div>
                      <div><span className="text-gray-500">Guests:</span> 4 guests (2 rooms)</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Current Rate:</span>
                      <span className="ml-2 font-semibold text-gray-900">$180/night</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Requested Rate:</span>
                      <span className="ml-2 font-semibold text-blue-600">$150/night</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Form */}
            <Card>
              <CardHeader>
                <CardTitle>Your Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rate Response */}
                <div>
                  <Label className="text-base font-medium">Rate Response</Label>
                  <RadioGroup value={responseType} onValueChange={setResponseType} className="mt-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="accept" id="accept" />
                      <Label htmlFor="accept">Accept Requested Rate ($150/night)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="counter" id="counter" />
                      <Label htmlFor="counter">Counter Offer with Different Rate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reject" id="reject" />
                      <Label htmlFor="reject">Cannot Accommodate at Requested Rate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="info" id="info" />
                      <Label htmlFor="info">Need More Information</Label>
                    </div>
                  </RadioGroup>
                </div>

                {responseType === "counter" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="counterRate">Counter Rate ($/night)</Label>
                      <Input
                        id="counterRate"
                        type="number"
                        value={counterRate}
                        onChange={(e) => setCounterRate(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="validity">Rate Validity</Label>
                      <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm">
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payment">Payment Terms</Label>
                    <select 
                      id="payment"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="50% deposit, balance at check-in">50% deposit, balance at check-in</option>
                      <option value="25% deposit, balance at check-in">25% deposit, balance at check-in</option>
                      <option value="Full payment at check-in">Full payment at check-in</option>
                      <option value="Custom terms">Custom terms (specify below)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="cancellation">Cancellation Policy</Label>
                    <select 
                      id="cancellation"
                      value={cancellationPolicy}
                      onChange={(e) => setCancellationPolicy(e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="Standard policy applies">Standard policy applies</option>
                      <option value="Flexible cancellation (48 hours)">Flexible cancellation (48 hours)</option>
                      <option value="Non-refundable rate">Non-refundable rate</option>
                      <option value="Custom policy">Custom policy (specify below)</option>
                    </select>
                  </div>
                </div>

                {/* Included Services */}
                <div>
                  <Label className="text-base font-medium">Included Services</Label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {[
                      { key: 'breakfast', label: 'Complimentary breakfast' },
                      { key: 'transfers', label: 'Airport transfers' },
                      { key: 'welcome', label: 'Welcome drink upon arrival' },
                      { key: 'checkout', label: 'Late check-out (subject to availability)' },
                      { key: 'upgrade', label: 'Room upgrade (subject to availability)' },
                      { key: 'spa', label: 'Spa/facility discounts' }
                    ].map(service => (
                      <div key={service.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={service.key}
                          checked={includedServices[service.key as keyof typeof includedServices]}
                          onCheckedChange={(checked) => handleServiceChange(service.key, checked as boolean)}
                        />
                        <Label htmlFor={service.key} className="text-sm">{service.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cultural Accommodations */}
                <div>
                  <Label className="text-base font-medium">Cultural Accommodations</Label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {[
                      { key: 'halal', label: 'Halal dining options confirmed' },
                      { key: 'prayer', label: 'Prayer mats available' },
                      { key: 'qibla', label: 'Qibla direction marked in rooms' },
                      { key: 'family', label: 'Separate family/female areas' },
                      { key: 'arabic', label: 'Arabic-speaking staff available' }
                    ].map(accommodation => (
                      <div key={accommodation.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={accommodation.key}
                          checked={culturalAccommodations[accommodation.key as keyof typeof culturalAccommodations]}
                          onCheckedChange={(checked) => handleCulturalChange(accommodation.key, checked as boolean)}
                        />
                        <Label htmlFor={accommodation.key} className="text-sm">{accommodation.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Provider Message */}
                <div>
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share any additional information, terms, or special offers for this booking..."
                    className="h-32 mt-2"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                  >
                    Submit Response
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agency Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Agency Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><span className="text-gray-500">Agency:</span> Travia Travel</div>
                <div><span className="text-gray-500">Volume:</span> 40-50 room nights/month</div>
                <div><span className="text-gray-500">Relationship:</span> New Partnership</div>
                <div><span className="text-gray-500">Previous Bookings:</span> N/A - First Request</div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Provider Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" size="sm" className="w-full justify-start text-blue-600">
                  Need help with pricing?
                </Button>
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>+971-xxx-xxxx</span>
                  </div>
                  <div>partners@travia.com</div>
                </div>
                <Button variant="ghost" size="sm" className="w-full justify-start text-blue-600">
                  Portal tutorial video
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Request Phone Call
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPortal;
