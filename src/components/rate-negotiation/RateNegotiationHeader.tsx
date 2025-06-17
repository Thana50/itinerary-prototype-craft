
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RateNegotiationHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/agent-dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rate Negotiation AI - Where Custom Trips Click.</h1>
            <p className="text-gray-600 mt-1">Automated negotiations with 85% time savings • Powered by SE Asian market intelligence</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            <Brain className="h-4 w-4 mr-1" />
            AI Enhanced
          </div>
          <span className="text-gray-600">Welcome, Agent!</span>
        </div>
      </div>
    </header>
  );
};

export default RateNegotiationHeader;
