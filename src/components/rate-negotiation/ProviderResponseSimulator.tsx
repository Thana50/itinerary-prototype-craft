
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import ResponseForm from "./simulator/ResponseForm";
import AIPreviewPanel from "./simulator/AIPreviewPanel";
import ProviderIntelligencePanel from "./simulator/ProviderIntelligencePanel";
import { sampleResponses } from "./simulator/sampleResponses";

interface ProviderResponseSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  negotiation: any;
  onResponseSubmit: (response: any) => void;
}

const ProviderResponseSimulator = ({ isOpen, onClose, negotiation, onResponseSubmit }: ProviderResponseSimulatorProps) => {
  const [responseType, setResponseType] = useState("Counter Offer");
  const [newRate, setNewRate] = useState(170);
  const [terms, setTerms] = useState("");
  const [message, setMessage] = useState("");
  const [responseTime, setResponseTime] = useState("6 hours");

  const handleResponseTypeChange = (type: string) => {
    setResponseType(type);
    const sample = sampleResponses[type as keyof typeof sampleResponses];
    if (sample) {
      setNewRate(sample.rate || negotiation?.targetRate || 150);
      setTerms(sample.terms);
      setMessage(sample.message.replace("Phuket Beach Resort & Spa", negotiation?.provider || "Phuket Beach Resort & Spa"));
    }
  };

  const getAIInsights = () => {
    const variance = newRate - (negotiation?.targetRate || 150);
    const percentage = ((variance / (negotiation?.targetRate || 150)) * 100).toFixed(1);
    
    return {
      variance,
      percentage,
      marketComparison: variance > 0 ? "6% above average market rate" : "3% below average market rate",
      assessment: Math.abs(variance) <= 15 ? "REASONABLE" : Math.abs(variance) <= 25 ? "HIGH" : "EXCESSIVE"
    };
  };

  const handleSubmit = () => {
    const response = {
      type: responseType,
      rate: newRate,
      terms,
      message,
      responseTime,
      timestamp: new Date().toISOString(),
      aiInsights: getAIInsights()
    };
    onResponseSubmit(response);
  };

  const insights = getAIInsights();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-purple-900 flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Provider Response Simulator
          </DialogTitle>
          <p className="text-sm text-gray-600">Simulate provider responses to test AI analysis and recommendation engine</p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Response Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Provider Response Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponseForm
                  negotiation={negotiation}
                  responseType={responseType}
                  newRate={newRate}
                  terms={terms}
                  message={message}
                  responseTime={responseTime}
                  onResponseTypeChange={handleResponseTypeChange}
                  onNewRateChange={setNewRate}
                  onTermsChange={setTerms}
                  onMessageChange={setMessage}
                  onResponseTimeChange={setResponseTime}
                />
              </CardContent>
            </Card>
          </div>

          {/* AI Preview Analysis - Right Side */}
          <div className="space-y-4">
            <AIPreviewPanel 
              insights={insights}
              responseType={responseType}
              responseTime={responseTime}
            />
            <ProviderIntelligencePanel />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Submit Response & Analyze
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderResponseSimulator;
