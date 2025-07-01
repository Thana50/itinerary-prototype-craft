
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProviderSelectorProps {
  provider: string;
}

const ProviderSelector = ({ provider }: ProviderSelectorProps) => {
  return (
    <div>
      <Label htmlFor="provider">Provider Name</Label>
      <Input 
        id="provider" 
        value={provider} 
        disabled 
        className="bg-gray-50"
      />
    </div>
  );
};

export default ProviderSelector;
