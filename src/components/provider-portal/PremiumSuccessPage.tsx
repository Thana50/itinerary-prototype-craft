
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Star, Award, TrendingUp, Clock, Download, MessageSquare, Calendar } from "lucide-react";

const PremiumSuccessPage = () => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const handleReturnToDashboard = () => {
    navigate('/vendor-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Success Section */}
      <div className="relative bg-gradient-to-r from-green-500 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div className={`transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
            <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Offer Submitted Successfully!</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your premium offer has been delivered to Travia Travel. Great things are about to happen!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Success Card */}
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What Happens Next?</h2>
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Your offer is now in the hands of our Gold Partner agency. Here's your timeline for success:
                </p>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-blue-800 mb-2">Within 2 Hours</h3>
                  <p className="text-sm text-blue-600">Agency reviews your premium offer</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-800 mb-2">Email Confirmation</h3>
                  <p className="text-sm text-green-600">You'll receive their decision notification</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-purple-800 mb-2">Booking Confirmation</h3>
                  <p className="text-sm text-purple-600">Start preparing for amazing guests</p>
                </div>
              </div>

              {/* Success Metrics */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4 text-center">Your Offer Performance Prediction</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">87%</p>
                    <p className="text-sm text-gray-600">Acceptance Probability</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">$1,155</p>
                    <p className="text-sm text-gray-600">Total Revenue Potential</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">$560</p>
                    <p className="text-sm text-gray-600">Projected Profit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* While You Wait Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">While You Wait</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Download className="h-4 w-4 mr-2" />
                    Download Partner Success Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-green-200 text-green-600 hover:bg-green-50">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Join Exclusive Partner WhatsApp
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-600 hover:bg-purple-50">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Strategy Call
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-orange-200 text-orange-600 hover:bg-orange-50">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Explore Co-Marketing
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Partnership Level Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Level</span>
                    <Badge className="bg-yellow-500 text-white">Gold Partner</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Platinum</span>
                      <span>28/50 bookings</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" style={{ width: '56%' }}></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-800 mb-2">Recent Achievements</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">Quick Responder Badge</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">Cultural Champion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Top Performing Partners This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <p className="font-medium text-yellow-800">Phuket Beach Resort & Spa</p>
                      <p className="text-sm text-yellow-600">28 bookings</p>
                    </div>
                  </div>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <p className="font-medium text-gray-800">Bangkok Elite Transfers</p>
                      <p className="text-sm text-gray-600">24 bookings</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <p className="font-medium text-orange-800">Phi Phi Island Tours</p>
                      <p className="text-sm text-orange-600">18 bookings</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleReturnToDashboard}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3"
            >
              Return to Vendor Dashboard
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 py-3"
              onClick={() => window.close()}
            >
              Close Portal
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Need to modify your response? Contact us at <span className="font-medium">partners@travia.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSuccessPage;
