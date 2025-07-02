
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const ProviderPortalHeader = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b shadow-lg">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Travia Partner Portal - Rate Negotiation
            </h1>
            <p className="text-gray-600">Negotiation Request from Travia Travel</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-xs font-medium text-white">LOGO</span>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
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
