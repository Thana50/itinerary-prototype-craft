
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ItineraryPreview from "@/components/ItineraryPreview";

interface TripOverviewFormProps {
  formData: {
    itineraryName: string;
    destination: string;
    startDate: string;
    endDate: string;
    numberOfTravelers: string;
    clientPreferences: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  sampleItinerary: any[];
}

const TripOverviewForm: React.FC<TripOverviewFormProps> = ({ formData, onFormChange, sampleItinerary }) => {
  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Details Saved",
      description: "Trip overview details have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trip Overview</CardTitle>
          <CardDescription className="text-gray-500">
            (We'll fill this out as we chat!)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSaveUpdate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="itineraryName" className="text-sm font-medium text-gray-700">
                  Itinerary Name
                </Label>
                <Input 
                  id="itineraryName"
                  name="itineraryName"
                  placeholder="e.g., Paradise Beach Adventure"
                  value={formData.itineraryName}
                  onChange={onFormChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
                  Destination
                </Label>
                <Input 
                  id="destination"
                  name="destination"
                  placeholder="e.g., Phuket, Thailand"
                  value={formData.destination}
                  onChange={onFormChange}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                    Start Date
                  </Label>
                  <Input 
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={onFormChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                    End Date
                  </Label>
                  <Input 
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={onFormChange}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="numberOfTravelers" className="text-sm font-medium text-gray-700">
                  Number of Travelers
                </Label>
                <Input 
                  id="numberOfTravelers"
                  name="numberOfTravelers"
                  placeholder="e.g., 4"
                  value={formData.numberOfTravelers}
                  onChange={onFormChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="clientPreferences" className="text-sm font-medium text-gray-700">
                  Client Preferences / Notes
                </Label>
                <Textarea 
                  id="clientPreferences"
                  name="clientPreferences"
                  placeholder="e.g., Luxury hotels, halal dining, cultural experiences"
                  value={formData.clientPreferences}
                  onChange={onFormChange}
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save/Update Details
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ItineraryPreview sampleItinerary={sampleItinerary} />
    </div>
  );
};

export default TripOverviewForm;
