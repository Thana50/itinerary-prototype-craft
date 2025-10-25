
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const LoginHeader = () => {
  return (
    <CardHeader className="text-center pb-4 pt-8">
      <div className="flex justify-center mb-4">
        <img 
          alt="Travia Logo" 
          className="h-24 w-auto drop-shadow-2xl" 
          src="/lovable-uploads/c7af2edd-ad30-440d-8a82-e27e44ff6b9b.png" 
        />
      </div>
      
      {/* Premium Branding */}
      <div className="space-y-3">
        <CardTitle className="text-4xl font-bold text-white mb-0 tracking-wider">
          TRAVIA
        </CardTitle>
        
        <p className="text-lg text-white/90 font-medium italic">
          Where Custom Trips Click.
        </p>
        
        <CardDescription className="text-white/70 text-sm font-light">
          AI-Powered Travel Itinerary Manager
        </CardDescription>
        
        <div className="pt-4 pb-2">
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
        
        <p className="text-white/60 text-xs">
          Demo Login - Use any of the emails below
        </p>
      </div>
    </CardHeader>
  );
};
