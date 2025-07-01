
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from "lucide-react";

const ProviderIntelligencePanel = () => {
  return (
    <Card className="bg-purple-50 border-purple-200">
      <CardHeader>
        <CardTitle className="text-sm text-purple-900">Provider Intelligence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-xs text-purple-700">
          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
          5 previous successful negotiations
        </div>
        <div className="flex items-center text-xs text-purple-700">
          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
          Usually accepts counter-offers
        </div>
        <div className="flex items-center text-xs text-purple-700">
          <AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" />
          Prefers quick responses (within 6 hours)
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderIntelligencePanel;
