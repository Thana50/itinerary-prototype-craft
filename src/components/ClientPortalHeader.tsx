
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
const ClientPortalHeader = ({
  tripDetails,
  customizationProgress
}: ClientPortalHeaderProps) => {
  return <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <img alt="Travia Logo" className="w-[240px] h-[60px] md:w-[280px] md:h-[70px] object-contain" src="/lovable-uploads/60dd85bc-f81b-4d18-a1bc-350f50be3e46.png" />
              <span className="text-gray-500 text-sm ml-3 font-normal hidden md:block">
                - Where Custom Trips Click.
              </span>
            </div>
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
    </header>;
};
export default ClientPortalHeader;
