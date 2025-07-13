
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { User } from "lucide-react";

interface TripOverviewFormProps {
  formData: {
    itineraryName: string;
    destination: string;
    startDate: string;
    endDate: string;
    numberOfTravelers: string;
    clientPreferences: string;
    assignedTravelerEmail: string;
  };
  onFormChange: (field: string, value: any) => void;
}

const TripOverviewForm: React.FC<TripOverviewFormProps> = ({ formData, onFormChange }) => {
  // Demo users for PoC
  const demoTravelers = [
    { email: 'traveler@demo.com', name: 'Demo Traveler' },
    { email: 'agent@demo.com', name: 'Demo Agent' },
    { email: 'vendor@demo.com', name: 'Demo Vendor' }
  ];

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Details Saved",
      description: "Trip overview details have been saved successfully.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  return (
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="assignedTraveler" className="text-sm font-medium text-gray-700">
                Assign to Client
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Select 
                  value={formData.assignedTravelerEmail} 
                  onValueChange={(value) => onFormChange('assignedTravelerEmail', value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select a client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {demoTravelers.map((traveler) => (
                      <SelectItem key={traveler.email} value={traveler.email}>
                        {traveler.name} ({traveler.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                onChange={handleInputChange}
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
  );
};

export default TripOverviewForm;
