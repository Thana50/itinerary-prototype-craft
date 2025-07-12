
import React from "react";
import AdvancedVendorFeatures from "./AdvancedVendorFeatures";
import { useToast } from "@/hooks/use-toast";

interface AdvancedVendorTabProps {
  vendorId: string;
  activeNegotiations?: any[];
}

const AdvancedVendorTab = ({ vendorId, activeNegotiations = [] }: AdvancedVendorTabProps) => {
  const { toast } = useToast();

  const handleFeatureAction = (action: string, data: any) => {
    console.log('Advanced vendor action:', action, data);
    
    switch (action) {
      case 'optimize_pricing':
        toast({
          title: "Pricing Optimization Started",
          description: "AI is analyzing market conditions to suggest optimal pricing strategies.",
        });
        break;
        
      case 'analyze_competition':
        toast({
          title: "Competition Analysis Updated",
          description: "Fresh competitive intelligence data has been gathered.",
        });
        break;
        
      case 'export_insights':
        toast({
          title: "Insights Exported",
          description: "Performance insights have been exported to your downloads.",
        });
        break;
        
      case 'value_add_updated':
        toast({
          title: "Value Add Updated",
          description: `Value add option ${data.checked ? 'enabled' : 'disabled'}.`,
        });
        break;
        
      case 'apply_suggestion':
        toast({
          title: "Smart Suggestion Applied",
          description: "AI recommendation has been applied to your negotiation strategy.",
        });
        break;
        
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <AdvancedVendorFeatures
      vendorId={vendorId}
      activeNegotiations={activeNegotiations}
      onFeatureAction={handleFeatureAction}
    />
  );
};

export default AdvancedVendorTab;
