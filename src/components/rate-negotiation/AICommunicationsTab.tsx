
import React from "react";
import CommunicationDashboard from "./CommunicationDashboard";

const AICommunicationsTab = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Communications Dashboard</h2>
        <p className="text-gray-600">Track all negotiation communications and manage provider relationships</p>
      </div>
      
      <CommunicationDashboard />
    </div>
  );
};

export default AICommunicationsTab;
