
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Brain, Clock, Target, Users, TrendingUp } from "lucide-react";

const AICommunicationsTab = () => {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [targetRate, setTargetRate] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("Standard");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const emailTemplates = [
    {
      id: "group-booking",
      name: "Group Booking Request",
      subject: "Group Rate Inquiry - [Service Name] for [Dates]",
      tone: "Professional, direct",
      keyPoints: "Group size, duration, halal requirements",
      successRate: 87,
      bestFor: "Hotels, resorts",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      id: "volume-partnership",
      name: "Volume Partnership Proposal",
      subject: "Partnership Opportunity - Consistent Booking Volume",
      tone: "Business partnership",
      keyPoints: "Monthly volume, repeat business, long-term relationship",
      successRate: 82,
      bestFor: "Tours, activities, transfers",
      icon: TrendingUp,
      color: "bg-green-500"
    },
    {
      id: "competitive-rate",
      name: "Competitive Rate Challenge",
      subject: "Rate Matching Request - [Service Name]",
      tone: "Competitive, data-driven",
      keyPoints: "Market comparison, competitor rates, value proposition",
      successRate: 74,
      bestFor: "When current rates are too high",
      icon: Target,
      color: "bg-orange-500"
    },
    {
      id: "cultural-accommodation",
      name: "Cultural Accommodation Request",
      subject: "Specialized Service Request - Middle Eastern Clients",
      tone: "Cultural sensitivity, premium service",
      keyPoints: "Halal dining, prayer facilities, family-friendly",
      successRate: 91,
      bestFor: "Cultural-specific requirements",
      icon: Brain,
      color: "bg-purple-500"
    }
  ];

  const providers = [
    "Phuket Beach Resort & Spa",
    "Phi Phi Island Tours",
    "Bangkok Airport Transfers",
    "Chiang Mai Elephant Sanctuary",
    "Singapore Marina Bay Hotel",
    "Kuala Lumpur Food Tours"
  ];

  const getRecommendedTemplate = () => {
    if (serviceType === "hotel") return emailTemplates[0];
    if (serviceType === "tour" || serviceType === "activity") return emailTemplates[1];
    if (specialRequirements.toLowerCase().includes("halal") || specialRequirements.toLowerCase().includes("prayer")) {
      return emailTemplates[3];
    }
    return emailTemplates[0];
  };

  const generateEmailPreview = () => {
    const template = emailTemplates.find(t => t.id === selectedTemplate) || getRecommendedTemplate();
    
    return `Subject: ${template.subject.replace('[Service Name]', 'Superior Ocean View Room').replace('[Dates]', 'March 15-22')}

Dear ${selectedProvider || '[Provider Name]'},

I hope this message finds you well. I'm reaching out on behalf of Travia Travel regarding a ${template.id === 'volume-partnership' ? 'partnership opportunity' : 'booking opportunity'} for one of our valued Middle Eastern clients.

Booking Details:
- Service: Superior Ocean View Room
- Dates: March 15-22, 2025 (7 nights)
- Group Size: 4 guests (2 rooms)
- Target Rate: $${targetRate || '150'}/night
${specialRequirements ? `- Special Requirements: ${specialRequirements}` : '- Special Requirements: Halal dining options, prayer facilities'}

${template.id === 'cultural-accommodation' 
  ? 'Our client specifically chose your property based on our recommendation and your excellent reputation for accommodating Middle Eastern travelers with cultural sensitivity.'
  : template.id === 'volume-partnership' 
  ? 'We are interested in establishing a long-term partnership that could benefit both our clients and your business with consistent booking volume.'
  : 'Our client has selected your property based on our recommendation and your excellent reputation in the area.'
}

${template.id === 'competitive-rate' 
  ? 'Our market research shows similar properties in the area at $145-155/night, and we would appreciate a competitive rate that matches the current market standards.'
  : template.id === 'volume-partnership'
  ? 'We book an average of 40-50 room nights per month in this area and would love to establish an ongoing partnership with preferred rates for our regular bookings.'
  : 'Given the group nature and duration of this booking, we would appreciate your best group rate for this accommodation.'
}

Could you please provide your best rate for these dates? We're looking to confirm this booking within ${urgencyLevel === 'Urgent' ? '24' : urgencyLevel === 'Priority' ? '48' : '72'} hours.

Thank you for your time and consideration.

Best regards,
[Agent Name]
Travia Travel - Where Custom Trips Click
Email: agent@travia.com
WhatsApp: +xxx-xxxx`;
  };

  return (
    <div className="space-y-6">
      {/* Email Template Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Template Management</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {emailTemplates.map((template) => (
            <Card key={template.id} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center mb-3">
                    <div className={`p-2 ${template.color} rounded-lg mr-3`}>
                      <template.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.tone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{template.successRate}%</div>
                    <p className="text-xs text-gray-500">Success Rate</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Subject:</strong> {template.subject}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Key Points:</strong> {template.keyPoints}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Best For:</strong> {template.bestFor}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Communication Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-purple-600" />
                Generate Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="tour">Tour</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template">Template Selection</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} ({template.successRate}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="target-rate">Target Rate</Label>
                  <Input
                    id="target-rate"
                    type="number"
                    placeholder="150"
                    value={targetRate}
                    onChange={(e) => setTargetRate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="special-requirements">Special Requirements</Label>
                <Textarea
                  id="special-requirements"
                  placeholder="Halal dining, prayer facilities, family-friendly accommodations..."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Priority">Priority</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      Preview Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Email Preview</DialogTitle>
                    </DialogHeader>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800">
                        {generateEmailPreview()}
                      </pre>
                    </div>
                  </DialogContent>
                </Dialog>
                <Select defaultValue="now">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="1hour">In 1 Hour</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow 9 AM</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Send Communication
                </Button>
                <Button variant="outline">
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Intelligence Panel */}
        <div>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                AI Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Recommended Template</h4>
                <p className="text-sm text-purple-700">
                  {getRecommendedTemplate().name} ({getRecommendedTemplate().successRate}% success rate)
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Best Send Time
                </h4>
                <p className="text-sm text-blue-700">
                  Tuesday 9-11 AM (highest response rate)
                </p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Provider Response Pattern</h4>
                <p className="text-sm text-green-700">
                  Usually responds within 6 hours
                </p>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Negotiation History</h4>
                <p className="text-sm text-orange-700">
                  3 previous successful negotiations with this provider
                </p>
              </div>

              <div className="p-3 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">Rate Strategy</h4>
                <p className="text-sm text-indigo-700">
                  Suggest opening 15% below target to allow negotiation room
                </p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Automation Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Auto-follow up after 24 hours</li>
                  <li>• Smart timezone scheduling</li>
                  <li>• Personalized using provider history</li>
                  <li>• Cultural customization</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AICommunicationsTab;
