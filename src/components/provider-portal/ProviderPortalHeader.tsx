
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const ProviderPortalHeader = () => {
  return (
    <div className="glass-card border-b shadow-lg relative z-10">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Travia Partner Portal - Rate Negotiation
            </h1>
            <p className="text-muted-foreground">Negotiation Request from Travia Travel</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-xs font-medium text-primary-foreground">LOGO</span>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
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
