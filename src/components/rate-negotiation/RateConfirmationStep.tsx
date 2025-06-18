
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, TrendingDown } from "lucide-react";

interface RateConfirmationStepProps {
  negotiation: any;
  onComplete: () => void;
  isCompleted: boolean;
}

const RateConfirmationStep = ({ negotiation, onComplete, isCompleted }: RateConfirmationStepProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const finalRate = 165;
  const savings = (negotiation.originalRate - finalRate) * negotiation.duration;
  const percentageSaved = ((negotiation.originalRate - finalRate) / negotiation.originalRate * 100).toFixed(1);

  const confirmedTerms = [
    { item: `Rate: $${finalRate}/night for ${negotiation.service}`, confirmed: true },
    { item: `Dates: March 15-22, 2025 (${negotiation.duration} nights)`, confirmed: true },
    { item: "Inclusions: Breakfast, airport transfers (one way)", confirmed: true },
    { item: "Payment: 25% deposit, balance at check-in", confirmed: true },
    { item: "Cancellation: 48 hours free cancellation", confirmed: true },
    { item: "Special Services: Halal dining, prayer mats available", confirmed: true }
  ];

  const handleConfirmRates = async () => {
    setIsConfirming(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConfirming(false);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-600 mr-2" />
            Negotiation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Original Rate</p>
              <p className="text-2xl font-bold text-gray-800">${negotiation.originalRate}/night</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Target Rate</p>
              <p className="text-2xl font-bold text-blue-800">${negotiation.targetRate}/night</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Final Negotiated Rate</p>
              <p className="text-2xl font-bold text-green-800">${finalRate}/night</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-800 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Savings Achieved
                </h4>
                <p className="text-sm text-green-700">
                  ${savings} total (${negotiation.originalRate - finalRate}/night × {negotiation.duration} nights)
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-800">{percentageSaved}% saved</p>
                <p className="text-sm text-green-600">Below original rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms Confirmed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {confirmedTerms.map((term, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">{term.item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {isCompleted ? (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-4 w-4 mr-1" />
            Rates Confirmed
          </Badge>
        ) : (
          <Button 
            onClick={handleConfirmRates}
            disabled={isConfirming}
            className="bg-green-600 hover:bg-green-700"
          >
            {isConfirming ? "Confirming..." : "Confirm Final Rates"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default RateConfirmationStep;
