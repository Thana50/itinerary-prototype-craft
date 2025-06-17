
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Brain } from "lucide-react";

const ProviderNetworkTab = () => {
  return (
    <div className="mt-6">
      <Card className="bg-white">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="h-12 w-12 text-blue-500 mr-2" />
            <Brain className="h-8 w-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Enhanced Provider Network</h3>
          <p className="text-gray-600 mb-4">Manage your network of Southeast Asian service providers with AI-powered negotiation preferences and cultural insights.</p>
          <div className="grid grid-cols-2 gap-4 mb-6 text-left">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Cultural Intelligence</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Middle Eastern client preferences</li>
                <li>• Halal dining requirements</li>
                <li>• Prayer time accommodations</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Market Intelligence</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Seasonal pricing patterns</li>
                <li>• Group booking leverage</li>
                <li>• Competitor rate analysis</li>
              </ul>
            </div>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Manage AI Provider Network
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderNetworkTab;
