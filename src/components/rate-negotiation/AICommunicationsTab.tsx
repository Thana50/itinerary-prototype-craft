
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Send, 
  Clock, 
  Target, 
  Users, 
  Building2, 
  TrendingUp, 
  MessageSquare,
  Calendar,
  Globe,
  Star,
  Zap,
  FileText,
  Settings
} from "lucide-react";

const AICommunicationsTab = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [targetRate, setTargetRate] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const emailTemplates = [
    {
      id: "group-booking",
      name: "Group Booking Request",
      subject: "Group Rate Inquiry - [Service Name] for [Dates]",
      tone: "Professional, direct",
      keyPoints: ["Group size", "Duration", "Halal requirements"],
      successRate: 87,
      bestFor: "Hotels, resorts",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: Users
    },
    {
      id: "volume-partnership",
      name: "Volume Partnership Proposal",
      subject: "Partnership Opportunity - Consistent Booking Volume",
      tone: "Business partnership",
      keyPoints: ["Monthly volume", "Repeat business", "Long-term relationship"],
      successRate: 82,
      bestFor: "Tours, activities, transfers",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      icon: Building2
    },
    {
      id: "competitive-rate",
      name: "Competitive Rate Challenge",
      subject: "Rate Matching Request - [Service Name]",
      tone: "Competitive, data-driven",
      keyPoints: ["Market comparison", "Competitor rates", "Value proposition"],
      successRate: 74,
      bestFor: "When current rates are too high",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      icon: TrendingUp
    },
    {
      id: "cultural-accommodation",
      name: "Cultural Accommodation Request",
      subject: "Specialized Service Request - Middle Eastern Clients",
      tone: "Cultural sensitivity, premium service",
      keyPoints: ["Halal dining", "Prayer facilities", "Family-friendly"],
      successRate: 91,
      bestFor: "Cultural-specific requirements",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      icon: Globe
    }
  ];

  const sampleEmail = `Subject: Group Rate Inquiry - Superior Ocean View Room for March 15-22

Dear Phuket Beach Resort & Spa,

I hope this message finds you well. I'm reaching out on behalf of Travia Travel regarding a group booking opportunity for one of our valued Middle Eastern clients.

Booking Details:
- Service: Superior Ocean View Room
- Dates: March 15-22, 2025 (7 nights)
- Group Size: 4 guests (2 rooms)
- Special Requirements: Halal dining options, prayer facilities

Our client specifically chose your property based on our recommendation and your excellent reputation for accommodating Middle Eastern travelers.

Given the group nature and duration of this booking, we would appreciate your best group rate for this accommodation. Our standard rate research shows similar properties in the area at $145-155/night, and we're hoping to secure a competitive rate that reflects the value of this extended stay.

We book an average of 40-50 room nights per month in the Phuket area and would love to establish an ongoing partnership that benefits both our clients and your business.

Could you please provide your best group rate for these dates? We're looking to confirm this booking within 48 hours.

Thank you for your time and consideration.

Best regards,
Sarah Johnson
Travia Travel - Where Custom Trips Click
Email: sarah@travia.com
WhatsApp: +971-50-123-4567`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Communications Engine
          </h2>
        </div>
        <p className="text-gray-600 text-lg">Automated email generation and provider outreach system</p>
      </div>

      {/* Email Template Management */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Email Template Library
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {emailTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 ${template.color} rounded-lg flex items-center justify-center mr-3`}>
                      <template.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-sm">{template.tone}</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {template.successRate}% success
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Subject Line:</p>
                  <p className="text-sm text-gray-600 italic">"{template.subject}"</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Key Points:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.keyPoints.map((point, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {point}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Best For: <span className="font-normal">{template.bestFor}</span></p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  Select Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Email Generator Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                <Send className="h-5 w-5 mr-2 text-purple-600" />
                Generate Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Provider</label>
                  <Select>
                    <SelectTrigger className="border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phuket-resort">Phuket Beach Resort & Spa</SelectItem>
                      <SelectItem value="phi-phi-tours">Phi Phi Island Tours</SelectItem>
                      <SelectItem value="bangkok-transfers">Bangkok Airport Transfers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Service Type</label>
                  <Select>
                    <SelectTrigger className="border-purple-200 focus:border-purple-400">
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

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Template Selection</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="Choose email template" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.successRate}% success)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Target Rate ($)</label>
                  <Input 
                    type="number" 
                    placeholder="150"
                    value={targetRate}
                    onChange={(e) => setTargetRate(e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Urgency Level</label>
                  <Select>
                    <SelectTrigger className="border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Special Requirements</label>
                <Textarea 
                  placeholder="Halal dining, prayer facilities, family-friendly amenities..."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      <FileText className="h-4 w-4 mr-2" />
                      Preview Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Email Preview</DialogTitle>
                    </DialogHeader>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                        {sampleEmail}
                      </pre>
                    </div>
                  </DialogContent>
                </Dialog>

                <Select>
                  <SelectTrigger className="w-40 border-blue-200 focus:border-blue-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Send timing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="1hour">In 1 Hour</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow 9 AM</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Send Communication
                </Button>

                <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Intelligence Panel */}
        <div>
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-blue-800">
                <Zap className="h-5 w-5 mr-2" />
                AI Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/80 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Recommended Template</span>
                </div>
                <p className="text-sm text-blue-700">Group Booking Request</p>
                <p className="text-xs text-blue-600">(87% success rate)</p>
              </div>

              <div className="bg-white/80 rounded-lg p-4 border border-green-200">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-green-800">Best Send Time</span>
                </div>
                <p className="text-sm text-green-700">Tuesday 9-11 AM</p>
                <p className="text-xs text-green-600">(highest response rate)</p>
              </div>

              <div className="bg-white/80 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center mb-2">
                  <Target className="h-4 w-4 text-purple-500 mr-2" />
                  <span className="text-sm font-medium text-purple-800">Provider Pattern</span>
                </div>
                <p className="text-sm text-purple-700">Usually responds within 6 hours</p>
                <p className="text-xs text-purple-600">High engagement provider</p>
              </div>

              <div className="bg-white/80 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-orange-800">Success History</span>
                </div>
                <p className="text-sm text-orange-700">3 successful negotiations</p>
                <p className="text-xs text-orange-600">Strong relationship</p>
              </div>

              <div className="bg-white/80 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <Settings className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Suggested Strategy</span>
                </div>
                <p className="text-sm text-blue-700">Start 15% below target</p>
                <p className="text-xs text-blue-600">Allow negotiation room</p>
              </div>
            </CardContent>
          </Card>

          {/* Automation Features */}
          <Card className="mt-6 shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-green-800">
                <Calendar className="h-5 w-5 mr-2" />
                Automation Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Auto Follow-up</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">24h</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Smart Scheduling</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Timezone</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Personalization</span>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">History</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Cultural Custom</span>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">Global</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AICommunicationsTab;
