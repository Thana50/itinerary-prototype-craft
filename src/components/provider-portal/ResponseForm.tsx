
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import RateResponseSection from "./form-sections/RateResponseSection";
import TermsConditionsSection from "./form-sections/TermsConditionsSection";
import IncludedServicesSection from "./form-sections/IncludedServicesSection";
import CulturalAccommodationsSection from "./form-sections/CulturalAccommodationsSection";
import AdditionalInfoSection from "./form-sections/AdditionalInfoSection";

interface ResponseFormProps {
  onSubmit: () => void;
}

const ResponseForm = ({ onSubmit }: ResponseFormProps) => {
  const navigate = useNavigate();
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

  const handleSaveAsDraft = () => {
    // Save draft logic here
    navigate('/vendor-dashboard');
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-800">Your Response</CardTitle>
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
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex-1"
          >
            Submit Response
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
            onClick={handleSaveAsDraft}
          >
            Save as Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseForm;
