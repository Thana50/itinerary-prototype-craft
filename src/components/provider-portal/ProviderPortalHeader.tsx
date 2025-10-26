import React from "react";
import UnifiedHeader from "@/components/common/UnifiedHeader";

const ProviderPortalHeader = () => {
  return (
    <UnifiedHeader 
      title="Travia Partner Portal - Rate Negotiation"
      subtitle="Negotiation Request from Travia Travel"
      showLogo={false}
      showNotifications={false}
      showLogout={false}
      showHelpButton={true}
      rightContent={
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-xs font-medium text-primary-foreground">LOGO</span>
        </div>
      }
    />
  );
};

export default ProviderPortalHeader;
