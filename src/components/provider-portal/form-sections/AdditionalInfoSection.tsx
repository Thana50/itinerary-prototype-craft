
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoSectionProps {
  message: string;
  setMessage: (value: string) => void;
}

const AdditionalInfoSection = ({ message, setMessage }: AdditionalInfoSectionProps) => {
  return (
    <div>
      <Label htmlFor="message">Additional Information</Label>
      <Textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share any additional information, terms, or special offers for this booking..."
        className="h-32 mt-2"
      />
    </div>
  );
};

export default AdditionalInfoSection;
