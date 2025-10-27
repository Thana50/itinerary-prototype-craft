import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, Users, MapPin, User, ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleTripContextProps {
  formData: {
    itineraryName: string;
    destination: string;
    startDate: string;
    endDate: string;
    numberOfTravelers: string;
    clientPreferences: string;
    assignedTravelerEmail: string;
  };
  onFormChange: (field: string, value: string) => void;
}

const CollapsibleTripContext: React.FC<CollapsibleTripContextProps> = ({
  formData,
  onFormChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);

  // Demo users for PoC
  const demoTravelers = [
    { email: 'traveler@demo.com', name: 'Demo Traveler' },
    { email: 'agent@demo.com', name: 'Demo Agent' },
    { email: 'vendor@demo.com', name: 'Demo Vendor' }
  ];

  // Generate summary badge text
  const getSummary = () => {
    const parts = [];
    if (formData.destination) parts.push(formData.destination);
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (days > 0) parts.push(`${days} days`);
    }
    
    if (formData.numberOfTravelers) parts.push(formData.numberOfTravelers);
    
    return parts.length > 0 ? `📋 ${parts.join(' • ')}` : '📋 No trip details set';
  };

  // Auto-collapse after 5 seconds when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Trigger pulse animation when form data changes
  useEffect(() => {
    setShouldPulse(true);
    const timer = setTimeout(() => setShouldPulse(false), 1000);
    return () => clearTimeout(timer);
  }, [formData.destination, formData.startDate, formData.endDate, formData.numberOfTravelers]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`shadow-lg border-blue-200 transition-all ${shouldPulse ? 'animate-pulse' : ''}`}>
        <CollapsibleTrigger asChild>
          <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2" />
                Trip Context
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            {!isOpen && (
              <p className="text-xs text-white/90 mt-1">{getSummary()}</p>
            )}
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="itineraryName" className="text-sm font-medium text-gray-700">
                Itinerary Name
              </Label>
              <Input
                id="itineraryName"
                value={formData.itineraryName}
                onChange={(e) => onFormChange('itineraryName', e.target.value)}
                placeholder="e.g., Romantic Paris Getaway"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
                Destination
              </Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => onFormChange('destination', e.target.value)}
                  placeholder="e.g., Paris, France"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => onFormChange('startDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => onFormChange('endDate', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="numberOfTravelers" className="text-sm font-medium text-gray-700">
                Number of Travelers
              </Label>
              <div className="relative mt-1">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="numberOfTravelers"
                  value={formData.numberOfTravelers}
                  onChange={(e) => onFormChange('numberOfTravelers', e.target.value)}
                  placeholder="e.g., 2 adults"
                  className="pl-10"
                />
              </div>
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
                Client Preferences & Special Requests
              </Label>
              <Textarea
                id="clientPreferences"
                value={formData.clientPreferences}
                onChange={(e) => onFormChange('clientPreferences', e.target.value)}
                placeholder="e.g., vegetarian meals, accessibility needs, budget constraints, interests..."
                rows={4}
                className="mt-1"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CollapsibleTripContext;
