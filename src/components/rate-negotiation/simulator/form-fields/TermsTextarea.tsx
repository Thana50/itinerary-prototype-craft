
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TermsTextareaProps {
  terms: string;
  onTermsChange: (terms: string) => void;
}

const TermsTextarea = ({ terms, onTermsChange }: TermsTextareaProps) => {
  return (
    <div>
      <Label htmlFor="terms">Terms & Conditions</Label>
      <Textarea 
        id="terms"
        value={terms}
        onChange={(e) => onTermsChange(e.target.value)}
        placeholder="Additional terms and conditions..."
        className="h-20"
      />
    </div>
  );
};

export default TermsTextarea;
