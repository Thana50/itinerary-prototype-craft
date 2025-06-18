
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, AlertCircle, CheckCircle, Clock } from "lucide-react";

const RealTimeDecisions = () => {
  const [overrideAction, setOverrideAction] = useState("");
  const [customRate, setCustomRate] = useState("");
  const [overrideReason, setOverrideReason] = useState("");

  const aiThoughtProcess = [
    { step: 1, text: "Requested rate: $150/night, Offered rate: $170/night", status: "complete" },
    { step: 2, text: "Market range for similar properties: $155-175/night", status: "complete" },
    { step: 3, text: "Provider's historical acceptance pattern: 78% success with counters", status: "complete" },
    { step: 4, text: "Group booking power: 4 guests = 15% leverage potential", status: "complete" },
    { step: 5, text: "Cultural requirements met: Halal dining confirmed", status: "analyzing" }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-blue-600 mr-2" />
              <CardTitle className="text-blue-900">Current Analysis</CardTitle>
            </div>
            <Badge className="bg-blue-600 text-white">ANALYZING</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 font-medium mb-4">Analyzing negotiation #TRV-001 (Phuket Beach Resort)</p>
          
          <div className="space-y-3">
            <h4 className="font-medium text-blue-900">AI Thought Process:</h4>
            {aiThoughtProcess.map((item) => (
              <div key={item.step} className="flex items-start">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold mr-3 mt-0.5">
                  {item.step}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <p className="text-sm text-blue-800">{item.text}</p>
                  {item.status === "complete" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-green-900">AI Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Badge className="bg-green-600 text-white mr-3">COUNTER OFFER</Badge>
              <span className="font-bold text-green-900">$160/night</span>
            </div>
            
            <p className="text-sm text-green-800 mb-3">
              <strong>Reasoning:</strong> Offer is reasonable but room for improvement. Counter likely to be accepted based on provider history and market position.
            </p>
            
            <div className="flex items-center">
              <span className="text-sm font-medium text-green-900 mr-2">Confidence:</span>
              <div className="flex-1 bg-green-200 rounded-full h-2 mr-3">
                <div className="h-2 bg-green-600 rounded-full" style={{ width: "78%" }}></div>
              </div>
              <span className="text-sm font-bold text-green-900">78%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
            <CardTitle>Manual Override Controls</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Override AI recommendation for this negotiation</Label>
            <Select value={overrideAction} onValueChange={setOverrideAction}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select custom action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accept">Accept current offer ($170/night)</SelectItem>
                <SelectItem value="reject">Reject and find alternative provider</SelectItem>
                <SelectItem value="counter">Counter with different rate</SelectItem>
                <SelectItem value="terms">Request additional terms without rate change</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {overrideAction === "counter" && (
            <div>
              <Label htmlFor="custom-rate" className="text-sm font-medium">Custom Counter Rate</Label>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 mr-2">$</span>
                <Input
                  id="custom-rate"
                  type="number"
                  placeholder="Enter rate per night"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  className="flex-1"
                />
                <span className="text-gray-500 ml-2">/night</span>
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium">Override Reason</Label>
            <Select value={overrideReason} onValueChange={setOverrideReason}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select reason for override" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Agent knows provider personally</SelectItem>
                <SelectItem value="budget">Client budget constraints</SelectItem>
                <SelectItem value="time">Time pressure for booking</SelectItem>
                <SelectItem value="relationship">Strategic relationship priority</SelectItem>
                <SelectItem value="other">Other (specify)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={!overrideAction || !overrideReason}
          >
            Execute Override
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">Recent AI Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-white border border-purple-200 rounded-lg">
              <p className="text-sm font-medium text-purple-900">Override #1: Agent accepted $175 when AI suggested counter to $165</p>
              <p className="text-xs text-purple-700 mt-1">Outcome: Successful booking, client satisfied</p>
              <p className="text-xs text-purple-600 mt-1">AI Learning: Updating acceptance threshold for this provider type</p>
            </div>
            <div className="p-3 bg-white border border-purple-200 rounded-lg">
              <p className="text-sm font-medium text-purple-900">Override #2: Agent rejected $160 when AI suggested acceptance</p>
              <p className="text-xs text-purple-700 mt-1">Outcome: Found alternative at $155, saved additional $5/night</p>
              <p className="text-xs text-purple-600 mt-1">AI Learning: Increasing market knowledge for budget alternatives</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeDecisions;
