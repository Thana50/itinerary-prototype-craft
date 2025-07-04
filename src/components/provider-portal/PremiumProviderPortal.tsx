
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { Star, Award, TrendingUp, Clock, DollarSign, Users, Calendar, CheckCircle2 } from "lucide-react";

const PremiumProviderPortal = () => {
  const navigate = useNavigate();
  const [counterRate, setCounterRate] = useState([165]);
  const [culturalServices, setCulturalServices] = useState({
    halal: true,
    prayer: true,
    family: false
  });
  const [valueAdds, setValueAdds] = useState({
    breakfast: false,
    transfer: false,
    upgrade: false
  });

  const acceptanceProbability = Math.max(50, 100 - Math.abs(counterRate[0] - 150) * 2);
  const revenueImpact = ((counterRate[0] - 85) / (180 - 85)) * 100; // Assuming $85 cost

  const handleSubmit = () => {
    navigate('/provider-portal/success');
  };

  const handleCulturalToggle = (service: string) => {
    setCulturalServices(prev => ({
      ...prev,
      [service]: !prev[service as keyof typeof prev]
    }));
  };

  const handleValueAddToggle = (service: string) => {
    setValueAdds(prev => ({
      ...prev,
      [service]: !prev[service as keyof typeof prev]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Welcome to the Travia Partner Network</h1>
            <p className="text-xl mb-6 text-blue-100">Where Premium Service Meets Smart Technology</p>
            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">Gold Partner Opportunity</Badge>
              <span className="text-sm text-blue-100">Powered by Travia</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Premium Welcome Message */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Dear Phuket Beach Resort & Spa Team,</h2>
              <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                You've been selected to participate in an exclusive rate negotiation opportunity from our Gold Partner agency. 
                This streamlined process takes just 3 minutes and can generate immediate booking revenue.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-yellow-800">Priority Placement</p>
                <p className="text-xs text-yellow-600">in agent recommendations</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-800">Market Access</p>
                <p className="text-xs text-green-600">Middle Eastern travelers</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-800">Fast Processing</p>
                <p className="text-xs text-blue-600">streamlined bookings</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-800">24/7 Support</p>
                <p className="text-xs text-purple-600">partnership assistance</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800">Let's create something amazing together.</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Negotiation Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Visualization */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Booking Request Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">March 15-22, 2025</p>
                        <p className="text-sm text-gray-600">7 nights</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">4 guests</p>
                        <p className="text-sm text-gray-600">2 rooms needed</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Requested: $150/night</p>
                        <p className="text-sm text-gray-600">Market rate: $180/night</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">Travia Travel</p>
                        <Badge className="bg-yellow-500 text-white">Gold Partner</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Rate Calculator */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Smart Rate Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Your Counter Offer</span>
                      <span className="text-2xl font-bold text-blue-600">${counterRate[0]}/night</span>
                    </div>
                    <Slider
                      value={counterRate}
                      onValueChange={setCounterRate}
                      max={200}
                      min={120}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$120</span>
                      <span>$200</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg text-center">
                      <p className="text-sm text-green-700 font-medium">Acceptance Probability</p>
                      <p className="text-2xl font-bold text-green-800">{acceptanceProbability}%</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center">
                      <p className="text-sm text-blue-700 font-medium">Revenue Impact</p>
                      <p className="text-2xl font-bold text-blue-800">{Math.round(revenueImpact)}%</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg text-center">
                      <p className="text-sm text-purple-700 font-medium">Profit Margin</p>
                      <p className="text-2xl font-bold text-purple-800">${counterRate[0] - 85}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cultural Requirements Showcase */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Cultural Services Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border-2 transition-all ${culturalServices.halal ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Halal Dining</h4>
                      <Switch
                        checked={culturalServices.halal}
                        onCheckedChange={() => handleCulturalToggle('halal')}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Certified Halal Kitchen Available</p>
                    <p className="text-xs text-gray-500 mt-1">Specialized Middle Eastern Cuisine</p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 transition-all ${culturalServices.prayer ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Prayer Facilities</h4>
                      <Switch
                        checked={culturalServices.prayer}
                        onCheckedChange={() => handleCulturalToggle('prayer')}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Private Prayer Rooms</p>
                    <p className="text-xs text-gray-500 mt-1">Qibla Direction Marked</p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 transition-all ${culturalServices.family ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Family Services</h4>
                      <Switch
                        checked={culturalServices.family}
                        onCheckedChange={() => handleCulturalToggle('family')}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Family Areas Available</p>
                    <p className="text-xs text-gray-500 mt-1">Children's Activities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Value-Add Services */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Enhance Your Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border-2 transition-all ${valueAdds.breakfast ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Include Breakfast</h4>
                      <Switch
                        checked={valueAdds.breakfast}
                        onCheckedChange={() => handleValueAddToggle('breakfast')}
                      />
                    </div>
                    <p className="text-sm text-gray-600">+$25/person/day value</p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 transition-all ${valueAdds.transfer ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Airport Transfer</h4>
                      <Switch
                        checked={valueAdds.transfer}
                        onCheckedChange={() => handleValueAddToggle('transfer')}
                      />
                    </div>
                    <p className="text-sm text-gray-600">+$45 value (one way)</p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 transition-all ${valueAdds.upgrade ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Room Upgrade</h4>
                      <Switch
                        checked={valueAdds.upgrade}
                        onCheckedChange={() => handleValueAddToggle('upgrade')}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Based on availability</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button 
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg"
              >
                Submit Premium Offer
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Partnership Benefits */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Partnership Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-yellow-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Join 200+ Premium Partners</p>
                      <p className="text-xs text-gray-600">Across Southeast Asia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">40% Booking Increase</p>
                      <p className="text-xs text-gray-600">Middle Eastern market</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">72-Hour Settlement</p>
                      <p className="text-xs text-gray-600">Fast payment processing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-purple-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Dedicated Support</p>
                      <p className="text-xs text-gray-600">Account management</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Stories */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Success Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      "Middle Eastern guest segment grew 300%. Cultural understanding is exceptional."
                    </p>
                    <p className="text-xs text-gray-600">- Samui Paradise Resort</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      "Smooth negotiation process. Zero booking issues, payments always on time."
                    </p>
                    <p className="text-xs text-gray-600">- Phi Phi Island Tours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Network Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Partners Revenue Growth</span>
                    <span className="font-semibold text-green-600">+25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Annual Booking Volume</span>
                    <span className="font-semibold text-blue-600">$2.3M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Response Time</span>
                    <span className="font-semibold text-purple-600">2 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumProviderPortal;
