
import React from "react";
import { Label } from "@/components/ui/label";

interface TermsConditionsSectionProps {
  paymentTerms: string;
  setPaymentTerms: (value: string) => void;
  cancellationPolicy: string;
  setCancellationPolicy: (value: string) => void;
}

const TermsConditionsSection = ({
  paymentTerms,
  setPaymentTerms,
  cancellationPolicy,
  setCancellationPolicy
}: TermsConditionsSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="payment">Payment Terms</Label>
        <select 
          id="payment"
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="50% deposit, balance at check-in">50% deposit, balance at check-in</option>
          <option value="25% deposit, balance at check-in">25% deposit, balance at check-in</option>
          <option value="Full payment at check-in">Full payment at check-in</option>
          <option value="Custom terms">Custom terms (specify below)</option>
        </select>
      </div>
      <div>
        <Label htmlFor="cancellation">Cancellation Policy</Label>
        <select 
          id="cancellation"
          value={cancellationPolicy}
          onChange={(e) => setCancellationPolicy(e.target.value)}
          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="Standard policy applies">Standard policy applies</option>
          <option value="Flexible cancellation (48 hours)">Flexible cancellation (48 hours)</option>
          <option value="Non-refundable rate">Non-refundable rate</option>
          <option value="Custom policy">Custom policy (specify below)</option>
        </select>
      </div>
    </div>
  );
};

export default TermsConditionsSection;
