
import React, { useRef, useEffect } from "react";
import TripOverviewForm from "@/components/TripOverviewForm";
import AIAssistant, { AIAssistantRef } from "@/components/AIAssistant";
import ClientLinkGenerator from "@/components/ClientLinkGenerator";
import TemplateSidebar from "@/components/templates/TemplateSidebar";
import TemplateConfirmationModal from "@/components/templates/TemplateConfirmationModal";
import { useTemplateIntegration } from "@/hooks/useTemplateIntegration";
import { Button } from "@/components/ui/button";
import { Lightbulb, X } from "lucide-react";

interface CreateItineraryContentProps {
  formData: {
    itineraryName: string;
    destination: string;
    startDate: string;
    endDate: string;
    numberOfTravelers: string;
    clientPreferences: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  sampleItinerary: any[];
  onMessageSend: (message: string) => Promise<string>;
  isLoading: boolean;
}

const CreateItineraryContent: React.FC<CreateItineraryContentProps> = ({
  formData,
  onFormChange,
  sampleItinerary,
  onMessageSend,
  isLoading
}) => {
  const aiAssistantRef = useRef<AIAssistantRef>(null);
  const {
    showTemplateSidebar,
    setShowTemplateSidebar,
    templateSearchQuery,
    setTemplateSearchQuery,
    selectedTemplate,
    showTemplateModal,
    handleTemplateSelect,
    handleTemplateConfirm,
    handleTemplateCancel,
    detectTemplateRelevance,
    convertTemplateToItinerary
  } = useTemplateIntegration();

  // Monitor form changes to show template suggestions
  useEffect(() => {
    detectTemplateRelevance(formData);
  }, [formData.destination, formData.numberOfTravelers, formData.startDate]);

  const handleMessageSend = async (message: string) => {
    try {
      const aiResponse = await onMessageSend(message);
      if (aiAssistantRef.current?.addAIMessage) {
        aiAssistantRef.current.addAIMessage(aiResponse);
      }
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleTemplateLoad = (template: any) => {
    const confirmedTemplate = handleTemplateConfirm(template);
    
    // Convert template to itinerary format and update the form
    const templateItinerary = convertTemplateToItinerary(confirmedTemplate);
    
    // Simulate the itinerary update (in real implementation, this would call a prop function)
    console.log('Loading template itinerary:', templateItinerary);
    
    // Add AI message about the loaded template
    if (aiAssistantRef.current?.addAIMessage) {
      aiAssistantRef.current.addAIMessage(
        `Perfect! I've loaded the "${confirmedTemplate.name}" template for your ${confirmedTemplate.destination} trip. This ${confirmedTemplate.duration}-day itinerary includes ${confirmedTemplate.activities.length} activities and has a ${confirmedTemplate.successRate}% success rate with other clients. You can now customize any part of this itinerary by asking me to make changes!`
      );
    }

    // Hide the template sidebar after loading
    setShowTemplateSidebar(false);
  };

  return (
    <div className="flex">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${showTemplateSidebar ? 'mr-80' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trip Overview Form */}
          <div className="lg:col-span-2">
            {/* Template Suggestion Banner */}
            {formData.destination && !showTemplateSidebar && sampleItinerary.length === 0 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-900">Quick Start with Templates</p>
                      <p className="text-sm text-blue-700">
                        I found proven templates for {formData.destination}. Want to see them?
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowTemplateSidebar(true)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View Templates
                  </Button>
                </div>
              </div>
            )}

            <TripOverviewForm 
              formData={formData} 
              onFormChange={onFormChange} 
              sampleItinerary={sampleItinerary}
            />
            
            {/* Client Link Generator */}
            <ClientLinkGenerator hasItinerary={sampleItinerary.length > 0} />
          </div>

          {/* Right Column - AI Chat Interface */}
          <div className="lg:col-span-1">
            <AIAssistant 
              ref={aiAssistantRef} 
              onMessageSend={handleMessageSend}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Template Sidebar */}
      <div className={`fixed right-0 top-0 h-full z-40 transition-transform duration-300 ${
        showTemplateSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex h-full">
          {/* Close button */}
          <div className="w-8 bg-gray-100 border-l border-gray-200 flex items-start justify-center pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTemplateSidebar(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <TemplateSidebar
            searchQuery={templateSearchQuery}
            onSearchChange={setTemplateSearchQuery}
            onTemplateSelect={handleTemplateSelect}
            isVisible={showTemplateSidebar}
          />
        </div>
      </div>

      {/* Template Confirmation Modal */}
      <TemplateConfirmationModal
        template={selectedTemplate}
        isOpen={showTemplateModal}
        onClose={handleTemplateCancel}
        onConfirm={handleTemplateLoad}
      />

      {/* Overlay for template sidebar */}
      {showTemplateSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-30"
          onClick={() => setShowTemplateSidebar(false)}
        />
      )}
    </div>
  );
};

export default CreateItineraryContent;
