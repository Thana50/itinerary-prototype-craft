
import React from "react";
import ResponseTypeSelector from "./ResponseTypeSelector";
import ProviderSelector from "./form-fields/ProviderSelector";
import RateInput from "./form-fields/RateInput";
import ResponseTimeSelector from "./form-fields/ResponseTimeSelector";
import TermsTextarea from "./form-fields/TermsTextarea";
import MessageTextarea from "./form-fields/MessageTextarea";

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
        <ProviderSelector provider={negotiation?.provider || ""} />
        <ResponseTypeSelector 
          responseType={responseType}
          onResponseTypeChange={onResponseTypeChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <RateInput 
          newRate={newRate}
          onNewRateChange={onNewRateChange}
        />
        <ResponseTimeSelector 
          responseTime={responseTime}
          onResponseTimeChange={onResponseTimeChange}
        />
      </div>

      <TermsTextarea 
        terms={terms}
        onTermsChange={onTermsChange}
      />

      <MessageTextarea 
        message={message}
        onMessageChange={onMessageChange}
      />
    </div>
  );
};

export default ResponseForm;
