
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Clock, ArrowLeft, Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

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
  showBackButton?: boolean;
}

const ClientPortalHeader = ({
  tripDetails,
  customizationProgress,
  showBackButton = false
}: ClientPortalHeaderProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/agent-dashboard");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumb Navigation */}
        {showBackButton && !isMobile && (
          <div className="mb-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={handleBackToDashboard} className="cursor-pointer flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    Agent Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Client AI Portal</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Mobile back button */}
            {showBackButton && isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToDashboard}
                className="mr-2 p-1"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            
            <div>
              <div className="flex items-center">
                {isMobile ? (
                  <span className="text-xl font-bold text-blue-600">TRAVIA</span>
                ) : (
                  <img 
                    alt="Travia Logo" 
                    className="w-[240px] h-[60px] md:w-[280px] md:h-[70px] object-contain" 
                    src="/lovable-uploads/60dd85bc-f81b-4d18-a1bc-350f50be3e46.png" 
                  />
                )}
                {!isMobile && (
                  <span className="text-gray-500 text-sm ml-3 font-normal hidden md:block">
                    - Where Custom Trips Click.
                  </span>
                )}
              </div>
              <p className="text-base md:text-lg text-gray-700 mt-1">
                Your Personalized Southeast Asian Adventure
              </p>
            </div>
          </div>
          
          {!isMobile && (
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                Customization in Progress
              </Badge>
              <div className="text-right">
                <div className="text-sm text-gray-600">Progress</div>
                <Progress value={customizationProgress} className="w-24" />
              </div>
            </div>
          )}
        </div>
        
        {/* Trip Summary */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
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
