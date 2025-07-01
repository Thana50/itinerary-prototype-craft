
import React from "react";
import { Label } from "@/components/ui/label";

interface ResponseTypeSelectorProps {
  responseType: string;
  onResponseTypeChange: (type: string) => void;
}

const ResponseTypeSelector = ({ responseType, onResponseTypeChange }: ResponseTypeSelectorProps) => {
  const responseTypes = [
    "Accept Target Rate",
    "Counter Offer", 
    "Reject - Too Low",
    "Request More Information",
    "Conditional Acceptance"
  ];

  return (
    <div>
      <Label htmlFor="responseType">Response Type</Label>
      <select 
        id="responseType"
        value={responseType}
        onChange={(e) => onResponseTypeChange(e.target.value)}
        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
      >
        {responseTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};

export default ResponseTypeSelector;
