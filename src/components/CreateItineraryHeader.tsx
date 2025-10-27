
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share, BookTemplate } from "lucide-react";
import UnifiedHeader from "@/components/common/UnifiedHeader";

interface CreateItineraryHeaderProps {
  currentUser: any;
  onLogout: () => void;
  onSaveItinerary: () => void;
  onBackToDashboard: () => void;
  isLoading: boolean;
  hasDestination: boolean;
}

const CreateItineraryHeader: React.FC<CreateItineraryHeaderProps> = ({
  currentUser,
  onLogout,
  onSaveItinerary,
  onBackToDashboard,
  isLoading,
  hasDestination
}) => {
  return (
    <>
      {/* Main Header */}
      <UnifiedHeader 
        showLogo={true}
        showNotifications={true}
        showLogout={true}
        userName={currentUser?.profile?.name || 'Agent'}
        onLogout={onLogout}
      />

      {/* Page Header */}
      <div className="glass-card border-b px-4 sm:px-6 py-4 relative z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Itinerary Builder
          </h1>
          <div className="flex gap-2">
            <Button 
              onClick={onSaveItinerary} 
              disabled={isLoading || !hasDestination}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Share className="mr-2 h-4 w-4" />
              Save & Share
            </Button>
            <Button variant="ghost" onClick={onBackToDashboard} size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateItineraryHeader;
