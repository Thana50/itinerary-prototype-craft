
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share, BookTemplate, Check } from "lucide-react";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import { toast } from "sonner";

interface CreateItineraryHeaderProps {
  currentUser: any;
  onLogout: () => void;
  onSaveItinerary: () => void;
  onBackToDashboard: () => void;
  onToggleTemplateSidebar: () => void;
  isLoading: boolean;
  hasDestination: boolean;
  showTemplateSidebar: boolean;
}

const CreateItineraryHeader: React.FC<CreateItineraryHeaderProps> = ({
  currentUser,
  onLogout,
  onSaveItinerary,
  onBackToDashboard,
  onToggleTemplateSidebar,
  isLoading,
  hasDestination,
  showTemplateSidebar
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveItinerary();
      setSaved(true);
      toast.success("Itinerary saved successfully!", {
        description: "Share link has been generated and added to your dashboard"
      });
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      toast.error("Failed to save itinerary");
    } finally {
      setIsSaving(false);
    }
  };

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
              onClick={onToggleTemplateSidebar}
              variant={showTemplateSidebar ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              <BookTemplate className="h-4 w-4" />
              {showTemplateSidebar ? 'Hide' : 'Show'} Templates
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || !hasDestination || isSaving}
              className={saved ? "bg-green-600" : "bg-primary hover:bg-primary/90"}
              size="sm"
            >
              {saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Share className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save & Share"}
                </>
              )}
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
