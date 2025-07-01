
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RateInputProps {
  newRate: number;
  onNewRateChange: (rate: number) => void;
}

const RateInput = ({ newRate, onNewRateChange }: RateInputProps) => {
  return (
    <div>
      <Label htmlFor="newRate">New Rate Offered ($)</Label>
      <Input 
        id="newRate"
        type="number"
        value={newRate}
        onChange={(e) => onNewRateChange(Number(e.target.value))}
      />
    </div>
  );
};

export default RateInput;
