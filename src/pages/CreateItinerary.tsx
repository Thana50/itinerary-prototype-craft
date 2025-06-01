
import React from "react";
import CreateItineraryHeader from "@/components/CreateItineraryHeader";
import CreateItineraryContent from "@/components/CreateItineraryContent";
import { useCreateItinerary } from "@/hooks/useCreateItinerary";

const CreateItinerary = () => {
  const {
    currentUser,
    formData,
    sampleItinerary,
    isLoading,
    handleChange,
    handleMessageSend,
    handleSaveItinerary,
    handleLogout,
    handleBackToDashboard
  } = useCreateItinerary();

  return (
    <div className="min-h-screen bg-gray-50">
      <CreateItineraryHeader
        currentUser={currentUser}
        onLogout={handleLogout}
        onSaveItinerary={handleSaveItinerary}
        onBackToDashboard={handleBackToDashboard}
        isLoading={isLoading}
        hasDestination={!!formData.destination}
      />

      <div className="container mx-auto px-6">
        <CreateItineraryContent
          formData={formData}
          onFormChange={handleChange}
          sampleItinerary={sampleItinerary}
          onMessageSend={handleMessageSend}
          isLoading={isLoading}
        />

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          © 2025 Travia. Where Custom Trips Click.
        </footer>
      </div>
    </div>
  );
};

export default CreateItinerary;
