
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface ResponseFormProps {
  onSubmit: () => void;
}

const ResponseForm = ({ onSubmit }: ResponseFormProps) => {
  const [responseType, setResponseType] = useState("counter");
  const [counterRate, setCounterRate] = useState(170);
  const [paymentTerms, setPaymentTerms] = useState("25% deposit, balance at check-in");
  const [cancellationPolicy, setCancellationPolicy] = useState("Standard policy applies");
  const [message, setMessage] = useState("");
  
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

  return (
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
            onClick={onSubmit}
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
  );
};

export default ResponseForm;
