
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, MessageCircle, Send, AlertCircle, Download, Share2, FileText } from "lucide-react";

interface TimelineStage {
  id: number;
  stage: string;
  status: "completed" | "current" | "pending";
  timestamp: string;
  details: string;
  aiAction: string;
  color: string;
  expandedContent?: any;
}

interface NegotiationTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  negotiation: any;
}

const NegotiationTimeline = ({ isOpen, onClose, negotiation }: NegotiationTimelineProps) => {
  const [activeTab, setActiveTab] = useState("timeline");
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  const timelineStages: TimelineStage[] = [
    {
      id: 1,
      stage: "Initiated",
      status: "completed",
      timestamp: "March 10, 2025 at 2:30 PM",
      details: "Negotiation started for Phuket Beach Resort",
      aiAction: "Generated professional outreach email",
      color: "bg-green-500",
      expandedContent: {
        type: "initial_request",
        subject: "Group Rate Inquiry - Superior Ocean View Rooms",
        message: "Dear Phuket Beach Resort team,\n\nWe are reaching out regarding accommodation for our valued clients...",
        aiNotes: "Optimized subject line for 23% higher open rates. Emphasized group booking and loyalty."
      }
    },
    {
      id: 2,
      stage: "Sent to Provider",
      status: "completed",
      timestamp: "March 10, 2025 at 2:35 PM",
      details: "Email delivered to resort reservations team",
      aiAction: "Tracking delivery and response patterns",
      color: "bg-blue-500",
      expandedContent: {
        type: "delivery_confirmation",
        deliveryStatus: "Successfully delivered",
        readReceipt: "Opened at 3:20 PM",
        providerProfile: "High response rate provider (95%)"
      }
    },
    {
      id: 3,
      stage: "Provider Responded",
      status: "completed",
      timestamp: "March 10, 2025 at 6:45 PM",
      details: "Counter offer received: $170/night",
      aiAction: "Analyzed offer and generated recommendations",
      color: "bg-orange-500",
      expandedContent: {
        type: "provider_response",
        counterOffer: 170,
        variance: "+13.3% from target",
        aiAnalysis: "Good starting point. Provider included value-adds (breakfast, transfers)."
      }
    },
    {
      id: 4,
      stage: "Under Review",
      status: "completed",
      timestamp: "March 11, 2025 at 9:00 AM",
      details: "Travel agent reviewing AI recommendations",
      aiAction: "Prepared 3 response options with success probabilities",
      color: "bg-yellow-500",
      expandedContent: {
        type: "review_options",
        options: [
          { strategy: "Accept current offer", probability: "100%", notes: "Safe choice, good value-adds" },
          { strategy: "Counter at $165", probability: "78%", notes: "Recommended based on provider history" },
          { strategy: "Counter at $160", probability: "45%", notes: "Aggressive, may require concessions" }
        ]
      }
    },
    {
      id: 5,
      stage: "Counter Sent",
      status: "completed",
      timestamp: "March 11, 2025 at 9:15 AM",
      details: "Counter proposal sent: $165/night with deposit terms",
      aiAction: "Optimized message timing and tone",
      color: "bg-purple-500",
      expandedContent: {
        type: "counter_sent",
        counterAmount: 165,
        strategy: "Professional tone with partnership emphasis",
        depositRequest: "Negotiated down to 25% from 50%"
      }
    },
    {
      id: 6,
      stage: "Pending Response",
      status: "current",
      timestamp: "Expected by March 12, 2025 at 6:00 PM",
      details: "Awaiting provider response to counter offer",
      aiAction: "Monitoring for response, will alert if overdue",
      color: "bg-gray-400"
    }
  ];

  const negotiationHistory = [
    {
      id: 1,
      date: "Feb 2025",
      service: "Standard Room (5 nights)",
      requested: 120,
      final: 135,
      outcome: "successful",
      rounds: 2,
      notes: "Quick to respond, flexible on extras"
    },
    {
      id: 2,
      date: "Jan 2025",
      service: "Suite Upgrade (3 nights)",
      requested: 200,
      final: 220,
      outcome: "successful",
      rounds: 1,
      notes: "Accepted first counter-offer"
    }
  ];

  const insights = {
    timing: {
      typicalResponse: "6 hours",
      bestTimeToFollowUp: "Tuesday 9-11 AM",
      responseRateDecrease: "15% after 48 hours"
    },
    behavior: {
      acceptanceRate: "80%",
      averageRounds: "2.3",
      breakfastInclusion: "90%"
    },
    current: {
      successProbability: "78%",
      expectedClosure: "Within 24 hours",
      confidenceLevel: "High"
    }
  };

  const renderTimeline = () => (
    <div className="space-y-6">
      {/* Interactive Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-8">
          {timelineStages.map((stage, index) => (
            <div key={stage.id} className="relative flex items-start">
              <div className={`absolute left-6 w-4 h-4 rounded-full ${stage.color} border-4 border-white shadow-lg z-10`}></div>
              <div className="ml-16 flex-1">
                <Card className={`cursor-pointer transition-all hover:shadow-md ${expandedStage === stage.id ? 'ring-2 ring-purple-500' : ''}`}>
                  <CardContent className="p-4" onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{stage.stage}</h4>
                        <p className="text-sm text-gray-600">{stage.timestamp}</p>
                      </div>
                      <Badge variant={stage.status === 'completed' ? 'default' : stage.status === 'current' ? 'secondary' : 'outline'}>
                        {stage.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{stage.details}</p>
                    <p className="text-xs text-purple-600 italic">{stage.aiAction}</p>
                    
                    {expandedStage === stage.id && stage.expandedContent && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        {stage.expandedContent.type === 'initial_request' && (
                          <div className="space-y-2">
                            <p className="font-medium">Subject: {stage.expandedContent.subject}</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{stage.expandedContent.message}</p>
                            <p className="text-xs text-purple-600">AI Notes: {stage.expandedContent.aiNotes}</p>
                          </div>
                        )}
                        {stage.expandedContent.type === 'provider_response' && (
                          <div className="space-y-2">
                            <p className="font-medium">Counter Offer: ${stage.expandedContent.counterOffer}/night</p>
                            <p className="text-sm">Variance: {stage.expandedContent.variance}</p>
                            <p className="text-xs text-purple-600">AI Analysis: {stage.expandedContent.aiAnalysis}</p>
                          </div>
                        )}
                        {stage.expandedContent.type === 'review_options' && (
                          <div className="space-y-2">
                            <p className="font-medium">AI Recommended Options:</p>
                            {stage.expandedContent.options.map((option: any, idx: number) => (
                              <div key={idx} className="text-sm p-2 bg-white rounded border">
                                <p className="font-medium">{option.strategy} - {option.probability}</p>
                                <p className="text-gray-600">{option.notes}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {/* Success Probability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Current Success Probability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{insights.current.successProbability}</div>
            <div className="text-gray-600 mb-4">Based on similar negotiations</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Expected Closure</p>
                <p className="font-medium">{insights.current.expectedClosure}</p>
              </div>
              <div>
                <p className="text-gray-600">Confidence Level</p>
                <p className="font-medium">{insights.current.confidenceLevel}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timing Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timing Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Provider typically responds within:</span>
              <span className="font-medium">{insights.timing.typicalResponse}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Best time to send follow-ups:</span>
              <span className="font-medium">{insights.timing.bestTimeToFollowUp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Response rate decreases:</span>
              <span className="font-medium">{insights.timing.responseRateDecrease}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Negotiation Behavior */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Negotiation Behavior</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Counter offer acceptance rate:</span>
              <span className="font-medium">{insights.behavior.acceptanceRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average negotiation rounds:</span>
              <span className="font-medium">{insights.behavior.averageRounds}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Includes breakfast:</span>
              <span className="font-medium">{insights.behavior.breakfastInclusion} of negotiations</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="text-2xl mr-3">💡</div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">AI Recommendation</h4>
              <p className="text-sm text-blue-800">
                This provider historically accepts counter-offers within 6 hours. If no response by 3 PM today, 
                send gentle follow-up mentioning previous successful partnerships.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Previous Negotiations with {negotiation?.provider}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {negotiationHistory.map((hist) => (
              <div key={hist.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{hist.service}</h4>
                    <p className="text-sm text-gray-600">{hist.date}</p>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    ✅ Successful ({hist.rounds} rounds)
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Requested: </span>
                    <span className="font-medium">${hist.requested}/night</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Final: </span>
                    <span className="font-medium">${hist.final}/night</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">Notes: {hist.notes}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Pattern Recognition</h4>
            <div className="space-y-1 text-sm">
              <p>• Success Rate with this provider: <span className="font-medium text-green-600">100%</span></p>
              <p>• Average discount achieved: <span className="font-medium">12%</span></p>
              <p>• Preferred negotiation style: <span className="font-medium">Professional with volume emphasis</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold text-purple-900">
              Negotiation Timeline - {negotiation?.provider}
            </DialogTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Timeline
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Save as Template
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "timeline"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("timeline")}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              Timeline
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "insights"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("insights")}
            >
              <AlertCircle className="h-4 w-4 inline mr-2" />
              Insights
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "history"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("history")}
            >
              <MessageCircle className="h-4 w-4 inline mr-2" />
              History
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === "timeline" && renderTimeline()}
            {activeTab === "insights" && renderInsights()}
            {activeTab === "history" && renderHistory()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NegotiationTimeline;
