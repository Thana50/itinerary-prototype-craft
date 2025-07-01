
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ResponseTypeSelector from "./ResponseTypeSelector";

interface ResponseFormProps {
  negotiation: any;
  responseType: string;
  newRate: number;
  terms: string;
  message: string;
  responseTime: string;
  onResponseTypeChange: (type: string) => void;
  onNewRateChange: (rate: number) => void;
  onTermsChange: (terms: string) => void;
  onMessageChange: (message: string) => void;
  onResponseTimeChange: (time: string) => void;
}

const ResponseForm = ({
  negotiation,
  responseType,
  newRate,
  terms,
  message,
  responseTime,
  onResponseTypeChange,
  onNewRateChange,
  onTermsChange,
  onMessageChange,
  onResponseTimeChange
}: ResponseFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="provider">Provider Name</Label>
          <Input 
            id="provider" 
            value={negotiation?.provider || ""} 
            disabled 
            className="bg-gray-50"
          />
        </div>
        <ResponseTypeSelector 
          responseType={responseType}
          onResponseTypeChange={onResponseTypeChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="newRate">New Rate Offered ($)</Label>
          <Input 
            id="newRate"
            type="number"
            value={newRate}
            onChange={(e) => onNewRateChange(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="responseTime">Response Time</Label>
          <select 
            id="responseTime"
            value={responseTime}
            onChange={(e) => onResponseTimeChange(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="Immediate">Immediate</option>
            <option value="2 hours">2 hours</option>
            <option value="6 hours">6 hours</option>
            <option value="24 hours">24 hours</option>
          </select>
        </div>
      </div>

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

      <div>
        <Label htmlFor="message">Provider Message</Label>
        <Textarea 
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Provider's response message..."
          className="h-40"
        />
      </div>
    </div>
  );
};

export default ResponseForm;
