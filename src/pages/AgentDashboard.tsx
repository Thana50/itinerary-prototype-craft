
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search, Share, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ItineraryList from "@/components/ItineraryList";
import ConversationalAgent from "@/components/ConversationalAgent";

const AgentDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Travel Agent Dashboard</h1>
          <p className="text-muted-foreground">Create and manage itineraries for your clients</p>
        </div>
        <Button onClick={() => navigate("/create-itinerary")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Itinerary
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Itineraries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vendor Negotiations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Itineraries</CardTitle>
              <CardDescription>Manage and track your client itineraries</CardDescription>
            </CardHeader>
            <CardContent>
              <ItineraryList role="agent" />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <ConversationalAgent role="agent" />
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
