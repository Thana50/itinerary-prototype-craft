
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
    console.log('🔵 [CreateItinerary] handleContinueWithoutTemplate called');
    console.log('🔵 [CreateItinerary] formData:', formData);
    
    if (formData.destination) {
      const duration = formData.clientPreferences.includes('Duration:') 
        ? formData.clientPreferences.split('Duration:')[1]?.split(',')[0]?.trim() || "7 days"
        : "7 days";
      console.log('🔵 [CreateItinerary] Generating itinerary for:', { destination: formData.destination, duration });
      generateItineraryWithoutTemplate(formData.destination, duration);
    } else {
      console.log('🔴 [CreateItinerary] No destination found, cannot generate itinerary');
    }
  };

  // Handle inline template selection from chat recommendations
  const handleInlineTemplateSelect = (template: ItineraryTemplate) => {
    const confirmedTemplate = handleTemplateConfirm(template);
    if (confirmedTemplate) {
      handleFormChange('itineraryName', confirmedTemplate.name);
      handleFormChange('destination', confirmedTemplate.destination);
      handleFormChange('numberOfTravelers', confirmedTemplate.duration?.toString() || '');
      handleFormChange('clientPreferences', confirmedTemplate.preview || '');

      const convertedItinerary = convertTemplateToItinerary(confirmedTemplate);
      updateSampleItinerary(convertedItinerary);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))] relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <CreateItineraryHeader
        currentUser={currentUser}
        onLogout={handleLogout}
        onSaveItinerary={handleSaveItinerary}
        onBackToDashboard={handleBackToDashboard}
        isLoading={isLoading}
        hasDestination={!!formData.destination}
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 relative z-10">
        <CreateItineraryContent
          formData={formData}
          onFormChange={handleFormChange}
          sampleItinerary={sampleItinerary}
          onMessageSend={handleMessageSend}
          onChatTemplateSelect={handleInlineTemplateSelect}
          onContinueWithoutTemplate={handleContinueWithoutTemplate}
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
