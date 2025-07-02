
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const RequestDetailsCard = () => {
  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-gray-800">Negotiation Request #TRV-2025-001</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Submitted: March 10, 2025 at 2:30 PM</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white">Standard</Badge>
            <Badge variant="outline" className="flex items-center gap-1 border-orange-200 text-orange-600">
              <Clock className="h-3 w-3" />
              48 hours left
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Client Information</h4>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">Client Type:</span> Group Booking</div>
              <div><span className="text-gray-500">Origin:</span> UAE</div>
              <div><span className="text-gray-500">Profile:</span> Middle Eastern Family</div>
              <div><span className="text-gray-500">Requirements:</span> Halal dining, prayer facilities</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Service Details</h4>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">Service:</span> Hotel Accommodation</div>
              <div><span className="text-gray-500">Room Type:</span> Superior Ocean View</div>
              <div><span className="text-gray-500">Dates:</span> March 15-22, 2025 (7 nights)</div>
              <div><span className="text-gray-500">Guests:</span> 4 guests (2 rooms)</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Current Rate:</span>
              <span className="ml-2 font-semibold text-gray-900">$180/night</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Requested Rate:</span>
              <span className="ml-2 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$150/night</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestDetailsCard;
