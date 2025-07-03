
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ValueAddEnhancementsProps {
  valueAdds: string[];
  onValueAddChange: (valueAddId: string, checked: boolean) => void;
}

const ValueAddEnhancements = ({ valueAdds, onValueAddChange }: ValueAddEnhancementsProps) => {
  const valueAddOptions = [
    {
      id: "breakfast",
      title: "Include breakfast for all guests",
      value: "+$25/person/day value"
    },
    {
      id: "transfer",
      title: "Complimentary airport transfer (one way)",
      value: "+$45 value"
    },
    {
      id: "upgrade",
      title: "Room upgrade based on availability",
      value: "no cost"
    },
    {
      id: "checkout",
      title: "Late checkout until 2 PM",
      value: "no cost"
    },
    {
      id: "fruit",
      title: "Welcome fruit basket",
      value: "+$15 value"
    },
    {
      id: "spa",
      title: "Spa discount - 20% off treatments",
      value: "discount offering"
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg">Value-Add Enhancements</CardTitle>
        <p className="text-sm text-gray-600">Enhance your offer with complimentary services</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {valueAddOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-3">
              <Checkbox
                id={option.id}
                checked={valueAdds.includes(option.id)}
                onCheckedChange={(checked) => onValueAddChange(option.id, checked as boolean)}
              />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                <span className="font-medium">{option.title}</span>
                <span className="text-sm text-gray-500 ml-2">({option.value})</span>
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ValueAddEnhancements;
