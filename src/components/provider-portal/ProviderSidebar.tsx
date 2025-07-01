
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Download } from "lucide-react";

const ProviderSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Agency Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agency Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div><span className="text-gray-500">Agency:</span> Travia Travel</div>
          <div><span className="text-gray-500">Volume:</span> 40-50 room nights/month</div>
          <div><span className="text-gray-500">Relationship:</span> New Partnership</div>
          <div><span className="text-gray-500">Previous Bookings:</span> N/A - First Request</div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provider Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="ghost" size="sm" className="w-full justify-start text-blue-600">
            Need help with pricing?
          </Button>
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>+971-xxx-xxxx</span>
            </div>
            <div>partners@travia.com</div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-blue-600">
            Portal tutorial video
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Phone className="h-4 w-4 mr-2" />
            Request Phone Call
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderSidebar;
