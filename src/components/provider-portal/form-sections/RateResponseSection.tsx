
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RateResponseSectionProps {
  responseType: string;
  setResponseType: (value: string) => void;
  counterRate: number;
  setCounterRate: (value: number) => void;
}

const RateResponseSection = ({ 
  responseType, 
  setResponseType, 
  counterRate, 
  setCounterRate 
}: RateResponseSectionProps) => {
  return (
    <div>
      <Label className="text-base font-medium">Rate Response</Label>
      <RadioGroup value={responseType} onValueChange={setResponseType} className="mt-3">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="accept" id="accept" />
          <Label htmlFor="accept">Accept Requested Rate ($150/night)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="counter" id="counter" />
          <Label htmlFor="counter">Counter Offer with Different Rate</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="reject" id="reject" />
          <Label htmlFor="reject">Cannot Accommodate at Requested Rate</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="info" id="info" />
          <Label htmlFor="info">Need More Information</Label>
        </div>
      </RadioGroup>

      {responseType === "counter" && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="counterRate">Counter Rate ($/night)</Label>
            <Input
              id="counterRate"
              type="number"
              value={counterRate}
              onChange={(e) => setCounterRate(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="validity">Rate Validity</Label>
            <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm">
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateResponseSection;
