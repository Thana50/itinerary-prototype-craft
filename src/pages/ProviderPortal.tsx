
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
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))] relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <ProviderPortalHeader />

      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
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
