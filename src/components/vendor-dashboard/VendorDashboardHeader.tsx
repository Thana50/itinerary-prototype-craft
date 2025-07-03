
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

const VendorDashboardHeader = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">LOGO</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Phuket Beach Resort & Spa
              </h1>
              <p className="text-lg text-gray-600 mt-1">Welcome back, Reservation Manager</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-gray-500">📍 Phuket, Thailand</span>
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  Gold Partner
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600">Quick Stats</p>
              <p className="font-semibold text-lg text-gray-800">3 pending requests</p>
              <p className="text-sm text-gray-600">12 completed this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardHeader;
