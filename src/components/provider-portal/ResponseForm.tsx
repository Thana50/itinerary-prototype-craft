
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RateResponseSection from "./form-sections/RateResponseSection";
import TermsConditionsSection from "./form-sections/TermsConditionsSection";
import IncludedServicesSection from "./form-sections/IncludedServicesSection";
import CulturalAccommodationsSection from "./form-sections/CulturalAccommodationsSection";
import AdditionalInfoSection from "./form-sections/AdditionalInfoSection";

interface ResponseFormProps {
  onSubmit: () => void;
}

const ResponseForm = ({ onSubmit }: ResponseFormProps) => {
  const [responseType, setResponseType] = useState("counter");
  const [counterRate, setCounterRate] = useState(170);
  const [paymentTerms, setPaymentTerms] = useState("25% deposit, balance at check-in");
  const [cancellationPolicy, setCancellationPolicy] = useState("Standard policy applies");
  const [message, setMessage] = useState("");
  
  const [includedServices, setIncludedServices] = useState({
    breakfast: true,
    transfers: true,
    welcome: false,
    checkout: false,
    upgrade: false,
    spa: false
  });

  const [culturalAccommodations, setCulturalAccommodations] = useState({
    halal: true,
    prayer: true,
    qibla: true,
    family: false,
    arabic: false
  });

  const handleServiceChange = (service: string, checked: boolean) => {
    setIncludedServices(prev => ({ ...prev, [service]: checked }));
  };

  const handleCulturalChange = (accommodation: string, checked: boolean) => {
    setCulturalAccommodations(prev => ({ ...prev, [accommodation]: checked }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Response</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RateResponseSection
          responseType={responseType}
          setResponseType={setResponseType}
          counterRate={counterRate}
          setCounterRate={setCounterRate}
        />

        <TermsConditionsSection
          paymentTerms={paymentTerms}
          setPaymentTerms={setPaymentTerms}
          cancellationPolicy={cancellationPolicy}
          setCancellationPolicy={setCancellationPolicy}
        />

        <IncludedServicesSection
          includedServices={includedServices}
          onServiceChange={handleServiceChange}
        />

        <CulturalAccommodationsSection
          culturalAccommodations={culturalAccommodations}
          onCulturalChange={handleCulturalChange}
        />

        <AdditionalInfoSection
          message={message}
          setMessage={setMessage}
        />

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={onSubmit}
            className="bg-blue-600 hover:bg-blue-700 flex-1"
          >
            Submit Response
          </Button>
          <Button variant="outline" className="flex-1">
            Save as Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseForm;
