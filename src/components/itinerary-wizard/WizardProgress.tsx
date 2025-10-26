import React from "react";
import { CheckCircle, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { id: 1, label: "Trip Details" },
    { id: 2, label: "AI Processing" },
    { id: 3, label: "Review & Approve" }
  ];

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-4">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                currentStep > step.id 
                  ? 'bg-green-500 border-green-500' 
                  : currentStep === step.id
                  ? 'bg-blue-500 border-blue-500 animate-pulse'
                  : 'bg-gray-100 border-gray-300'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <Circle className={`h-5 w-5 ${currentStep === step.id ? 'text-white' : 'text-gray-400'}`} />
                )}
              </div>
              <span className={`text-xs mt-2 font-medium text-center ${
                currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardProgress;
