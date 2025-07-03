
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, TrendingUp, Trophy } from "lucide-react";

const VendorStatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Pending Requests</p>
              <p className="text-3xl font-bold">3</p>
              <p className="text-xs text-orange-200 mt-1">↗️ +2 since yesterday</p>
              <p className="text-xs text-orange-200">1 expires in 6 hours</p>
            </div>
            <Clock className="h-8 w-8 text-orange-100" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">This Month's Business</p>
              <p className="text-3xl font-bold">$4,680</p>
              <p className="text-xs text-green-200 mt-1">28 room nights</p>
              <p className="text-xs text-green-200">↗️ +15% vs last month</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-100" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Response Performance</p>
              <p className="text-3xl font-bold">4.2h</p>
              <p className="text-xs text-blue-200 mt-1">100% response rate</p>
              <p className="text-xs text-blue-200">⭐⭐⭐⭐⭐</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-100" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Success Rate</p>
              <p className="text-3xl font-bold">89%</p>
              <p className="text-xs text-purple-200 mt-1">67% repeat business</p>
              <p className="text-xs text-purple-200">Partner Score: 92/100</p>
            </div>
            <Trophy className="h-8 w-8 text-purple-100" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorStatsCards;
