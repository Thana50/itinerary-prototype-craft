
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface ValueAddAnalysisProps {
  providerResponse: any;
}

const ValueAddAnalysis = ({ providerResponse }: ValueAddAnalysisProps) => {
  const getValueAddAnalysis = () => {
    const benefits = [];
    const concerns = [];
    
    if (providerResponse.terms.includes("breakfast")) {
      benefits.push({ item: "Includes breakfast", value: "$25/person/day" });
    }
    if (providerResponse.terms.includes("transfers")) {
      benefits.push({ item: "Includes transfers", value: "$45 one-way" });
    }
    if (providerResponse.terms.includes("halal")) {
      benefits.push({ item: "Confirms halal dining availability", value: "Cultural requirement met" });
    }
    if (providerResponse.terms.includes("50% deposit")) {
      concerns.push({ item: "Requires 50% deposit", suggestion: "Negotiate to 25%" });
    }
    
    return { benefits, concerns };
  };

  const valueAnalysis = getValueAddAnalysis();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Value-Add Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {valueAnalysis.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">{benefit.item}</span>
              <span className="text-sm text-green-600 ml-auto">Value: {benefit.value}</span>
            </div>
          ))}
          {valueAnalysis.concerns.map((concern, idx) => (
            <div key={idx} className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm text-gray-700">{concern.item}</span>
              <span className="text-sm text-orange-600 ml-auto">{concern.suggestion}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ValueAddAnalysis;
