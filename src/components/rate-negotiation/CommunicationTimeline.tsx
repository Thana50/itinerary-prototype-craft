
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Clock, MessageCircle, Send, Eye, Star, Phone, Calendar, FileText, Download } from "lucide-react";

interface CommunicationTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  negotiation: any;
}

const CommunicationTimeline = ({ isOpen, onClose, negotiation }: CommunicationTimelineProps) => {
  const [activeTab, setActiveTab] = useState("timeline");
  const [newNote, setNewNote] = useState("");

  const communicationHistory = [
    {
      id: 1,
      timestamp: "March 10, 2025 at 2:30 PM",
      type: "Initial Request",
      typeColor: "bg-blue-500",
      sender: "Travia",
      status: "Delivered ✓",
      preview: "Group Rate Inquiry - Superior Ocean View Room for 4 guests, March 15-22...",
      fullMessage: "Dear Phuket Beach Resort & Spa team,\n\nWe are reaching out regarding accommodation for our valued clients - a family of 4 from UAE requiring 2 Superior Ocean View rooms for March 15-22, 2025 (7 nights).\n\nRequested rate: $150/night\nSpecial requirements: Halal dining options, prayer facilities\n\nWe appreciate your consideration and look forward to your response."
    },
    {
      id: 2,
      timestamp: "March 10, 2025 at 6:45 PM",
      type: "Counter Offer",
      typeColor: "bg-orange-500",
      sender: "Provider",
      status: "AI Analyzed ✓",
      preview: "Thank you for your inquiry. Our best group rate is $170/night...",
      fullMessage: "Thank you for your inquiry. We appreciate your interest in our property. For the dates March 15-22, our best group rate for 2 Superior Ocean View rooms is $170/night (down from our standard $180/night).\n\nThis rate includes:\n- Complimentary breakfast for all guests\n- Airport transfers (one way)\n- Access to halal dining options\n- Prayer mats and Qibla direction in rooms\n\nWe require a 50% deposit within 7 days."
    },
    {
      id: 3,
      timestamp: "March 11, 2025 at 9:15 AM",
      type: "Counter Proposal",
      typeColor: "bg-purple-500",
      sender: "Travia",
      status: "Delivered ✓",
      preview: "Thank you for your quick response. We appreciate the offer...",
      fullMessage: "Thank you for your quick response. We appreciate the offer and value-adds provided. We would like to propose $160/night with the same inclusions, and request reducing the deposit requirement to 25%. This would help us secure the booking immediately."
    }
  ];

  const responseAnalytics = {
    avgResponseTime: "4.2 hours",
    fastestResponse: "1.5 hours",
    responseRate: "100% (3/3 messages)",
    bestResponseTime: "Tuesday 6-8 PM",
    typicalCounter: "10-15% above requested rate",
    acceptanceRate: "80% after 2nd round",
    preferredTerms: "25% deposit, flexible cancellation",
    valueAddFrequency: "Always includes breakfast"
  };

  const relationshipScore = {
    overall: 87,
    responseRate: 100,
    flexibility: 85,
    valueAdd: 90,
    competitiveness: 80
  };

  const renderTimeline = () => (
    <div className="space-y-4">
      {communicationHistory.map((message, index) => (
        <Card key={message.id} className="border-l-4 border-l-gray-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Badge className={`${message.typeColor} text-white`}>
                  {message.type}
                </Badge>
                <span className="text-sm text-gray-600">{message.sender}</span>
              </div>
              <div className="text-xs text-gray-500">{message.timestamp}</div>
            </div>
            
            <p className="text-sm text-gray-700 mb-2">{message.preview}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-600">{message.status}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View Full
                </Button>
                {message.sender === "Travia" ? (
                  <Button size="sm" variant="outline" className="text-xs">
                    <Send className="h-3 w-3 mr-1" />
                    Resend
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Important
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Response Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Response Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Average Response Time</p>
              <p className="font-semibold text-lg text-green-600">{responseAnalytics.avgResponseTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="font-semibold text-lg text-green-600">{responseAnalytics.responseRate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fastest Response</p>
              <p className="font-semibold text-lg">{responseAnalytics.fastestResponse}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Response Time</p>
              <p className="font-semibold text-lg">{responseAnalytics.bestResponseTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Negotiation Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Negotiation Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Typical Counter Offer:</span>
              <span className="text-sm font-medium">{responseAnalytics.typicalCounter}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Acceptance Rate:</span>
              <span className="text-sm font-medium">{responseAnalytics.acceptanceRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Preferred Terms:</span>
              <span className="text-sm font-medium">{responseAnalytics.preferredTerms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Value-Add Frequency:</span>
              <span className="text-sm font-medium">{responseAnalytics.valueAddFrequency}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relationship Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            Partnership Score
            <Badge className="ml-2 bg-green-500 text-white">{relationshipScore.overall}/100</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Response Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${relationshipScore.responseRate}%`}}></div>
                </div>
                <span className="text-sm font-medium">{relationshipScore.responseRate}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Negotiation Flexibility</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${relationshipScore.flexibility}%`}}></div>
                </div>
                <span className="text-sm font-medium">{relationshipScore.flexibility}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Value-Add Offerings</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${relationshipScore.valueAdd}%`}}></div>
                </div>
                <span className="text-sm font-medium">{relationshipScore.valueAdd}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rate Competitiveness</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${relationshipScore.competitiveness}%`}}></div>
                </div>
                <span className="text-sm font-medium">{relationshipScore.competitiveness}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActions = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" className="justify-start">
              <Send className="h-4 w-4 mr-2" />
              Send Follow-Up Reminder
            </Button>
            <Button variant="outline" className="justify-start">
              <Phone className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Set Follow-Up Reminder
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Conversation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Provider Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Provider Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add private notes about this provider..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="mb-3"
          />
          <Button size="sm">Save Note</Button>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Communication Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Preferred Method:</span>
              <span className="font-medium">Email (Portal)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Language:</span>
              <span className="font-medium">English</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Zone:</span>
              <span className="font-medium">GMT+7 (Bangkok)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business Hours:</span>
              <span className="font-medium">9 AM - 6 PM</span>
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
          <DialogTitle className="text-xl font-semibold text-purple-900">
            Communication Dashboard - {negotiation?.provider}
          </DialogTitle>
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
              <MessageCircle className="h-4 w-4 inline mr-2" />
              Timeline
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "analytics"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "actions"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("actions")}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Actions
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === "timeline" && renderTimeline()}
            {activeTab === "analytics" && renderAnalytics()}
            {activeTab === "actions" && renderActions()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommunicationTimeline;
