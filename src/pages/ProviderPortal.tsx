
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProviderPortalHeader from "@/components/provider-portal/ProviderPortalHeader";
import RequestDetailsCard from "@/components/provider-portal/RequestDetailsCard";
import ResponseForm from "@/components/provider-portal/ResponseForm";
import ProviderSidebar from "@/components/provider-portal/ProviderSidebar";
import SuccessConfirmation from "@/components/provider-portal/SuccessConfirmation";

const ProviderPortal = () => {
  const { id } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return <SuccessConfirmation />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderPortalHeader />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <RequestDetailsCard />
            <ResponseForm onSubmit={handleSubmit} />
          </div>

          {/* Sidebar */}
          <ProviderSidebar />
        </div>
      </div>
    </div>
  );
};

export default ProviderPortal;
