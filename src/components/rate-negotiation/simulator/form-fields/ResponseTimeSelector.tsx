
import React from "react";
import { Label } from "@/components/ui/label";

interface ResponseTimeSelectorProps {
  responseTime: string;
  onResponseTimeChange: (time: string) => void;
}

const ResponseTimeSelector = ({ responseTime, onResponseTimeChange }: ResponseTimeSelectorProps) => {
  const timeOptions = [
    "Immediate",
    "2 hours",
    "6 hours",
    "24 hours"
  ];

  return (
    <div>
      <Label htmlFor="responseTime">Response Time</Label>
      <select 
        id="responseTime"
        value={responseTime}
        onChange={(e) => onResponseTimeChange(e.target.value)}
        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
      >
        {timeOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default ResponseTimeSelector;
