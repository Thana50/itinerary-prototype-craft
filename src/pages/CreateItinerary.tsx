
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
    handleFormChange,
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

      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <CreateItineraryContent
          formData={formData}
          onFormChange={handleFormChange}
          sampleItinerary={sampleItinerary}
          onMessageSend={handleMessageSend}
          isLoading={isLoading}
        />

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          © 2025 Travia. Where Custom Trips Click.
        </footer>
      </div>
    </div>
  );
};

export default CreateItinerary;
