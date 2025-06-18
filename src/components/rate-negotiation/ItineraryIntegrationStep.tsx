
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, FileText, ArrowRight } from "lucide-react";

interface ItineraryIntegrationStepProps {
  negotiation: any;
  onComplete: () => void;
  isCompleted: boolean;
}

const ItineraryIntegrationStep = ({ negotiation, onComplete, isCompleted }: ItineraryIntegrationStepProps) => {
  const [updateActions, setUpdateActions] = useState({
    pricing: false,
    inclusions: false,
    totalCost: false,
    confirmation: false,
    contacts: false
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleActionChange = (action: string, checked: boolean) => {
    setUpdateActions(prev => ({ ...prev, [action]: checked }));
  };

  const handleUpdateItinerary = async () => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUpdating(false);
    onComplete();
  };

  const allActionsSelected = Object.values(updateActions).every(Boolean);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            Itinerary Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-3">Before Negotiation</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Day 1-7:</strong> {negotiation.provider}</p>
                <p>Rate: ${negotiation.originalRate}/night (estimated)</p>
                <p>Total: ${negotiation.originalRate * negotiation.duration} for {negotiation.duration} nights</p>
                <Badge variant="outline" className="text-red-600 border-red-300">
                  Provisional pricing
                </Badge>
              </div>
            </div>

            {/* After */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">After Negotiation</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Day 1-7:</strong> {negotiation.provider} ✅</p>
                <p>Rate: $165/night (negotiated)</p>
                <p>Total: $1,155 for {negotiation.duration} nights</p>
                <p className="text-green-600 font-medium">Savings: $105 saved</p>
                <p className="text-green-600">Inclusions: Breakfast + transfers added (value: $245)</p>
                <Badge className="bg-green-500 text-white">
                  Confirmed booking
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Actions Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { key: 'pricing', label: 'Update itinerary pricing with negotiated rates' },
              { key: 'inclusions', label: 'Add negotiated inclusions to day-by-day schedule' },
              { key: 'totalCost', label: 'Update total trip cost calculation' },
              { key: 'confirmation', label: 'Mark accommodation as confirmed' },
              { key: 'contacts', label: 'Add provider contact details to itinerary' }
            ].map((action) => (
              <div key={action.key} className="flex items-center space-x-3">
                <Checkbox
                  id={action.key}
                  checked={updateActions[action.key as keyof typeof updateActions]}
                  onCheckedChange={(checked) => handleActionChange(action.key, checked as boolean)}
                />
                <label 
                  htmlFor={action.key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {action.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {isCompleted ? (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-4 w-4 mr-1" />
            Itinerary Updated
          </Badge>
        ) : (
          <Button 
            onClick={handleUpdateItinerary}
            disabled={!allActionsSelected || isUpdating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUpdating ? "Updating Itinerary..." : "Update Itinerary"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ItineraryIntegrationStep;
