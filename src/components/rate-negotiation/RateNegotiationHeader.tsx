import React from "react";
import UnifiedHeader from "@/components/common/UnifiedHeader";

const RateNegotiationHeader = () => {
  return (
    <UnifiedHeader 
      title="Rate Negotiation AI - Where Custom Trips Click."
      subtitle="Automated negotiations with 85% time savings • Powered by SE Asian market intelligence"
      showLogo={false}
      showNotifications={false}
      showLogout={false}
      showBackButton={true}
      backUrl="/vendor-dashboard"
      showAIBadge={true}
      userName="Agent"
    />
  );
};

export default RateNegotiationHeader;
