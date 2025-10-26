import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";

interface ItineraryCustomizationToolsProps {
  onAddDay: () => void;
  onRemoveDay: () => void;
  currentDayCount: number;
}

const ItineraryCustomizationTools: React.FC<ItineraryCustomizationToolsProps> = ({
  onAddDay,
  onRemoveDay,
  currentDayCount
}) => {
  const handleAddDay = () => {
    onAddDay();
    toast.success(`Day ${currentDayCount + 1} added successfully`, {
      description: "You can now add activities to this day"
    });
  };

  const handleRemoveDay = () => {
    if (currentDayCount <= 1) {
      toast.error("Cannot remove the last day");
      return;
    }
    onRemoveDay();
    toast.success(`Day ${currentDayCount} removed successfully`);
  };

  return (
    <Card className="border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" />
          Quick Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">Days in itinerary:</span>
          <span className="font-semibold text-foreground">{currentDayCount}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleAddDay}
            size="sm"
            variant="outline"
            className="gap-2 hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="h-3 w-3" />
            Add Day
          </Button>
          <Button
            onClick={handleRemoveDay}
            size="sm"
            variant="outline"
            disabled={currentDayCount <= 1}
            className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Minus className="h-3 w-3" />
            Remove Day
          </Button>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Use the AI chat below to add or remove specific activities
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItineraryCustomizationTools;
