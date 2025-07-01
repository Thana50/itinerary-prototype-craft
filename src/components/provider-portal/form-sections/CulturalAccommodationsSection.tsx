
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CulturalAccommodationsSectionProps {
  culturalAccommodations: Record<string, boolean>;
  onCulturalChange: (accommodation: string, checked: boolean) => void;
}

const CulturalAccommodationsSection = ({ 
  culturalAccommodations, 
  onCulturalChange 
}: CulturalAccommodationsSectionProps) => {
  const accommodations = [
    { key: 'halal', label: 'Halal dining options confirmed' },
    { key: 'prayer', label: 'Prayer mats available' },
    { key: 'qibla', label: 'Qibla direction marked in rooms' },
    { key: 'family', label: 'Separate family/female areas' },
    { key: 'arabic', label: 'Arabic-speaking staff available' }
  ];

  return (
    <div>
      <Label className="text-base font-medium">Cultural Accommodations</Label>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {accommodations.map(accommodation => (
          <div key={accommodation.key} className="flex items-center space-x-2">
            <Checkbox
              id={accommodation.key}
              checked={culturalAccommodations[accommodation.key]}
              onCheckedChange={(checked) => onCulturalChange(accommodation.key, checked as boolean)}
            />
            <Label htmlFor={accommodation.key} className="text-sm">{accommodation.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CulturalAccommodationsSection;
