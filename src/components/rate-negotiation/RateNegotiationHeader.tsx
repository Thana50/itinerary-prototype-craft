
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RateNegotiationHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="glass-card border-b shadow-lg px-6 py-4 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/vendor-dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Rate Negotiation AI - Where Custom Trips Click.
            </h1>
            <p className="text-muted-foreground mt-1">
              Automated negotiations with 85% time savings • Powered by SE Asian market intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
            <Brain className="h-4 w-4 mr-1" />
            AI Enhanced
          </div>
          <span className="text-muted-foreground">Welcome, Agent!</span>
        </div>
      </div>
    </header>
  );
};

export default RateNegotiationHeader;
