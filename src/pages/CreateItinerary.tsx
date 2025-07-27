
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CreateItineraryHeader from "@/components/CreateItineraryHeader";
import CreateItineraryContent from "@/components/CreateItineraryContent";
import TemplateIntegrationProvider from "@/components/TemplateIntegrationProvider";
import { useCreateItinerary } from "@/hooks/useCreateItinerary";
import { useTemplateIntegration } from "@/hooks/useTemplateIntegration";
import { ItineraryTemplate } from "@/types/templates";

const CreateItinerary = () => {
  const location = useLocation();
  const {
    currentUser,
    formData,
    sampleItinerary,
    isLoading,
    handleFormChange,
    handleMessageSend,
    handleSaveItinerary,
    handleLogout,
    handleBackToDashboard,
    updateSampleItinerary,
    generateItineraryWithoutTemplate
  } = useCreateItinerary();

  const {
    showTemplateSidebar,
    templateSearchQuery,
    setTemplateSearchQuery,
    selectedTemplate,
    showTemplateModal,
    handleTemplateSelect,
    handleTemplateConfirm,
    handleTemplateCancel,
    detectTemplateRelevance,
    convertTemplateToItinerary,
    toggleTemplateSidebar
  } = useTemplateIntegration();

  // Handle incoming template from navigation state (from Template Repository)
  useEffect(() => {
    const incomingTemplate = location.state?.template as ItineraryTemplate;
    if (incomingTemplate) {
      console.log('Received template from navigation:', incomingTemplate);
      handleTemplateSelect(incomingTemplate);
    }
  }, [location.state, handleTemplateSelect]);

  // Auto-detect template relevance when form data changes
  useEffect(() => {
    detectTemplateRelevance(formData);
  }, [formData, detectTemplateRelevance]);

  // Handle template confirmation and apply to itinerary
  const handleTemplateConfirmation = () => {
    if (!selectedTemplate) return;
    
    const template = handleTemplateConfirm(selectedTemplate);
    if (template) {
      // Apply template data to form
      handleFormChange('itineraryName', template.name);
      handleFormChange('destination', template.destination);
      handleFormChange('numberOfTravelers', template.duration?.toString() || '');
      handleFormChange('clientPreferences', template.preview || '');
      
      // Convert template to itinerary format and update sample
      const convertedItinerary = convertTemplateToItinerary(template);
      updateSampleItinerary(convertedItinerary);
    }
  };

  // Handle continue without template
  const handleContinueWithoutTemplate = () => {
    if (formData.destination) {
      const duration = formData.clientPreferences.includes('Duration:') 
        ? formData.clientPreferences.split('Duration:')[1]?.split(',')[0]?.trim() || "7 days"
        : "7 days";
      generateItineraryWithoutTemplate(formData.destination, duration);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CreateItineraryHeader
        currentUser={currentUser}
        onLogout={handleLogout}
        onSaveItinerary={handleSaveItinerary}
        onBackToDashboard={handleBackToDashboard}
        onToggleTemplateSidebar={toggleTemplateSidebar}
        isLoading={isLoading}
        hasDestination={!!formData.destination}
        showTemplateSidebar={showTemplateSidebar}
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

      {/* Template Integration */}
      <TemplateIntegrationProvider
        showTemplateSidebar={showTemplateSidebar}
        templateSearchQuery={templateSearchQuery}
        onSearchChange={setTemplateSearchQuery}
        onTemplateSelect={handleTemplateSelect}
        showTemplateModal={showTemplateModal}
        selectedTemplate={selectedTemplate}
        onTemplateConfirm={handleTemplateConfirmation}
        onTemplateCancel={handleTemplateCancel}
        onToggleSidebar={toggleTemplateSidebar}
        onContinueWithoutTemplate={handleContinueWithoutTemplate}
      />
    </div>
  );
};

export default CreateItinerary;
