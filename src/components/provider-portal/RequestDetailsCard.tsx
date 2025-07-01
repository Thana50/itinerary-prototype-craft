
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const RequestDetailsCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Negotiation Request #TRV-2025-001</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Submitted: March 10, 2025 at 2:30 PM</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">Standard</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
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
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Current Rate:</span>
              <span className="ml-2 font-semibold text-gray-900">$180/night</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Requested Rate:</span>
              <span className="ml-2 font-semibold text-blue-600">$150/night</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestDetailsCard;
