
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Trophy, DollarSign, Send, FileText, Clock } from "lucide-react";
import RateConfirmationStep from "./RateConfirmationStep";
import ItineraryIntegrationStep from "./ItineraryIntegrationStep";
import ClientCommunicationStep from "./ClientCommunicationStep";
import InternalDocumentationStep from "./InternalDocumentationStep";
import AutomationSetupStep from "./AutomationSetupStep";

interface CompletionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  negotiation: any;
}

const CompletionWizard = ({ isOpen, onClose, negotiation }: CompletionWizardProps) => {
  const [currentStep, setCurrentStep] = useState("rate-confirmation");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);

  const steps = [
    { id: "rate-confirmation", label: "Rate Confirmation", icon: DollarSign },
    { id: "itinerary-integration", label: "Itinerary Update", icon: FileText },
    { id: "client-communication", label: "Client Communication", icon: Send },
    { id: "documentation", label: "Documentation", icon: Clock },
    { id: "automation", label: "Automation Setup", icon: CheckCircle }
  ];

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    const currentIndex = steps.findIndex(step => step.id === stepId);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleFinalCompletion = async () => {
    setIsCompleting(true);
    
    // Simulate completion process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsCompleting(false);
    onClose();
    
    // Show success notification
    console.log('Negotiation completed successfully!');
  };

  const isStepCompleted = (stepId: string) => completedSteps.includes(stepId);
  const allStepsCompleted = completedSteps.length === steps.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
            Complete Successful Negotiation
          </DialogTitle>
          <p className="text-gray-600">
            Finalize your negotiation and update all systems with the confirmed terms
          </p>
        </DialogHeader>

        <div className="mt-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = isStepCompleted(step.id);
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${isCompleted ? 'bg-green-500 border-green-500' : 
                      isActive ? 'bg-blue-500 border-blue-500' : 'bg-gray-200 border-gray-300'}`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    )}
                  </div>
                  <div className="ml-2 text-sm">
                    <div className={`font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                      {step.label}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <Tabs value={currentStep} onValueChange={setCurrentStep}>
            <TabsContent value="rate-confirmation">
              <RateConfirmationStep 
                negotiation={negotiation}
                onComplete={() => handleStepComplete("rate-confirmation")}
                isCompleted={isStepCompleted("rate-confirmation")}
              />
            </TabsContent>

            <TabsContent value="itinerary-integration">
              <ItineraryIntegrationStep 
                negotiation={negotiation}
                onComplete={() => handleStepComplete("itinerary-integration")}
                isCompleted={isStepCompleted("itinerary-integration")}
              />
            </TabsContent>

            <TabsContent value="client-communication">
              <ClientCommunicationStep 
                negotiation={negotiation}
                onComplete={() => handleStepComplete("client-communication")}
                isCompleted={isStepCompleted("client-communication")}
              />
            </TabsContent>

            <TabsContent value="documentation">
              <InternalDocumentationStep 
                negotiation={negotiation}
                onComplete={() => handleStepComplete("documentation")}
                isCompleted={isStepCompleted("documentation")}
              />
            </TabsContent>

            <TabsContent value="automation">
              <AutomationSetupStep 
                negotiation={negotiation}
                onComplete={() => handleStepComplete("automation")}
                isCompleted={isStepCompleted("automation")}
              />
            </TabsContent>
          </Tabs>

          {/* Completion Actions */}
          {allStepsCompleted && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mt-6">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Ready to Complete!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 mb-4">
                  All steps have been completed successfully. Click below to finalize the negotiation and apply all updates.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleFinalCompletion}
                    disabled={isCompleting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isCompleting ? "Completing..." : "Complete Negotiation"}
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Save Draft & Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompletionWizard;
