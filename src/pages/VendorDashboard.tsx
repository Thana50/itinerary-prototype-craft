
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, Calendar, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NegotiationList from "@/components/NegotiationList";
import ConversationalAgent from "@/components/ConversationalAgent";

const VendorDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <p className="text-muted-foreground">Manage service requests and pricing negotiations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Negotiations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-3xl font-bold">4</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-3xl font-bold">2</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Confirmed Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-3xl font-bold">7</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pricing Negotiations</CardTitle>
                <CardDescription>Review and respond to pricing requests</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <NegotiationList />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <ConversationalAgent role="vendor" />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
