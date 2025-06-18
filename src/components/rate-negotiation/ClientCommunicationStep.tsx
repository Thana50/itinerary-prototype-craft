
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, Send, Mail } from "lucide-react";

interface ClientCommunicationStepProps {
  negotiation: any;
  onComplete: () => void;
  isCompleted: boolean;
}

const ClientCommunicationStep = ({ negotiation, onComplete, isCompleted }: ClientCommunicationStepProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState("good-news");
  const [customMessage, setCustomMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const templates = {
    "good-news": {
      subject: "Great news! We've secured better rates for your Phuket trip",
      content: `Dear [Client Name],

Excellent news about your upcoming Phuket vacation!

I'm thrilled to confirm that I've successfully negotiated an even better rate for your stay at ${negotiation.provider}. Here's what I've secured for you:

✅ Final Rate: $165/night (down from $180/night)
✅ Total Savings: $105 for your 7-night stay  
✅ BONUS: Complimentary breakfast for all guests (value: $175)
✅ BONUS: Airport transfer included (value: $45)
✅ Confirmed: Halal dining options and prayer facilities

Your accommodation is now fully confirmed for March 15-22, 2025. The resort is excited to welcome you and has noted all your special requirements.

I'll send you the updated itinerary with all the new inclusions added to your daily schedule.

Looking forward to helping you have an amazing trip!

Best regards,
[Agent Name]
Travia Travel - Where Custom Trips Click`,
      tone: "Excited, professional"
    },
    "booking-confirmation": {
      subject: "Your Phuket accommodation is confirmed - with bonus inclusions!",
      content: `Dear [Client Name],

I'm pleased to confirm your accommodation booking for your Phuket vacation.

BOOKING CONFIRMATION DETAILS:
• Property: ${negotiation.provider}
• Dates: March 15-22, 2025 (7 nights)
• Rate: $165/night (negotiated from $180/night)
• Total Accommodation Cost: $1,155
• Savings Achieved: $105

INCLUDED SERVICES:
✅ Daily breakfast for all guests
✅ One-way airport transfer
✅ Halal dining options confirmed
✅ Prayer facilities available

PAYMENT TERMS:
• Deposit Required: 25% ($288.75)
• Due Date: March 5, 2025
• Balance: Payable at check-in
• Cancellation: Free up to 48 hours prior

Your reservation is confirmed and guaranteed. I'll send payment instructions separately.

Best regards,
[Agent Name]
Travia Travel`,
      tone: "Professional, detailed"
    }
  };

  const handleSendMessage = async () => {
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    onComplete();
  };

  const currentTemplate = templates[selectedTemplate as keyof typeof templates];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 text-blue-600 mr-2" />
            Client Update Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good-news" id="good-news" />
                <Label htmlFor="good-news" className="font-medium">Good News Update</Label>
                <Badge variant="outline">Excited, professional</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="booking-confirmation" id="booking-confirmation" />
                <Label htmlFor="booking-confirmation" className="font-medium">Booking Confirmation</Label>
                <Badge variant="outline">Professional, detailed</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-medium">Custom Message</Label>
                <Badge variant="outline">Write your own</Badge>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTemplate === "custom" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <input 
                  id="subject"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Enter email subject..."
                />
              </div>
              <div>
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  placeholder="Write your custom message..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={10}
                  className="mt-1"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Subject Line</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                  {currentTemplate.subject}
                </div>
              </div>
              <div>
                <Label>Message Content</Label>
                <div className="mt-1 p-4 bg-gray-50 rounded-md border max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {currentTemplate.content}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {isCompleted ? (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-4 w-4 mr-1" />
            Message Sent
          </Badge>
        ) : (
          <Button 
            onClick={handleSendMessage}
            disabled={isSending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? "Sending..." : "Send to Client"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClientCommunicationStep;
