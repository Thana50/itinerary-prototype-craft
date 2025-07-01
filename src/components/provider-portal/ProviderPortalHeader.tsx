
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const ProviderPortalHeader = () => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Travia Partner Portal - Rate Negotiation</h1>
            <p className="text-gray-600">Negotiation Request from Travia Travel</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-xs font-medium">LOGO</span>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600">
              <HelpCircle className="h-4 w-4 mr-1" />
              Need Help?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPortalHeader;
