
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Users, Clock } from "lucide-react";

interface TripDetails {
  destination: string;
  duration: string;
  travelers: string;
  startDate: string;
  endDate: string;
}

interface ClientPortalHeaderProps {
  tripDetails: TripDetails;
  customizationProgress: number;
}

const ClientPortalHeader = ({ tripDetails, customizationProgress }: ClientPortalHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              TRAVIA
              <span className="text-gray-600 text-sm ml-2 font-normal">
                - Where Custom Trips Click.
              </span>
            </h1>
            <p className="text-lg text-gray-700 mt-1">
              Your Personalized Southeast Asian Adventure
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              Customization in Progress
            </Badge>
            <div className="text-right">
              <div className="text-sm text-gray-600">Progress</div>
              <Progress value={customizationProgress} className="w-24" />
            </div>
          </div>
        </div>
        
        {/* Trip Summary */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-blue-500" />
            {tripDetails.destination}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-green-500" />
            {tripDetails.duration}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-purple-500" />
            {tripDetails.travelers}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-orange-500" />
            {tripDetails.startDate} - {tripDetails.endDate}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientPortalHeader;
