
import React, { useState, useEffect } from "react";
import TripOverviewForm from "./TripOverviewForm";
import ItineraryPreview from "./ItineraryPreview";
import ModificationTracking from "./ModificationTracking";
import PricingUpdates from "./PricingUpdates";
import ApprovalWorkflow from "./ApprovalWorkflow";
import WeatherForecast from "./WeatherForecast";
import AIAssistantCard from "./AIAssistantCard";
import TemplateIntegrationProvider from "./TemplateIntegrationProvider";
import WorkflowActions from "./WorkflowActions";
import { useTemplateIntegration } from "@/hooks/useTemplateIntegration";
import { ItineraryTemplate } from "@/types/templates";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";

interface Modification {
  id: string;
  description: string;
  priceChange: number;
  timestamp: Date;
}

interface CreateItineraryContentProps {
  formData: any;
  onFormChange: (field: string, value: any) => void;
  sampleItinerary: any[];
  onMessageSend: (message: string) => void;
  isLoading: boolean;
}

const CreateItineraryContent: React.FC<CreateItineraryContentProps> = ({
  formData,
  onFormChange,
  sampleItinerary,
  onMessageSend,
  isLoading
}) => {
  const [modifications, setModifications] = useState<Modification[]>([]);
  const [totalPrice, setTotalPrice] = useState(12847);
  const [showEnhancedChat, setShowEnhancedChat] = useState(true);
  
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

  useEffect(() => {
    detectTemplateRelevance(formData);
  }, [formData]);

  const handleTemplateFromChat = (template: ItineraryTemplate) => {
    handleTemplateSelect(template);
  };

  const handleConfirmTemplate = () => {
    if (selectedTemplate) {
      const templateItinerary = convertTemplateToItinerary(selectedTemplate);
      
      // Update form data with template information
      onFormChange('destination', selectedTemplate.destination);
      onFormChange('numberOfTravelers', 4);
      
      // Convert template to modifications for tracking
      const templateModifications: Modification[] = selectedTemplate.activities.map((activity, index) => ({
        id: `template-${index}`,
        description: `Added from template: ${activity.title}`,
        priceChange: Math.floor(selectedTemplate.estimatedCost.min / selectedTemplate.activities.length / 4),
        timestamp: new Date()
      }));
      
      setModifications(templateModifications);
      setTotalPrice(selectedTemplate.estimatedCost.min);
      
      toast({
        title: "Template Loaded Successfully",
        description: `${selectedTemplate.name} template has been applied to your itinerary.`,
      });
      
      handleTemplateConfirm(selectedTemplate);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Template Sidebar Toggle Button - Fixed position when sidebar is closed */}
      {!showTemplateSidebar && (
        <Button
          onClick={toggleTemplateSidebar}
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 z-50 bg-white shadow-lg hover:shadow-xl"
        >
          <PanelRightOpen className="h-4 w-4 mr-2" />
          Templates
        </Button>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${showTemplateSidebar ? 'mr-80' : 'mr-0'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <TripOverviewForm formData={formData} onFormChange={onFormChange} />
              
              <AIAssistantCard
                showEnhancedChat={showEnhancedChat}
                onToggleChat={() => setShowEnhancedChat(!showEnhancedChat)}
                onTemplateSelect={handleTemplateFromChat}
                onMessageSend={onMessageSend}
                isLoading={isLoading}
              />

              <ModificationTracking modifications={modifications} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <ItineraryPreview sampleItinerary={sampleItinerary} />
              <PricingUpdates totalPrice={totalPrice} modifications={modifications} />
              <WeatherForecast />
              
              <WorkflowActions
                onApproval={() => alert('Itinerary Approved!')}
                onCall={() => alert('Requesting agent call...')}
                onSave={() => alert('Saving changes...')}
                onShare={() => alert('Sharing itinerary...')}
                onPrint={() => alert('Printing itinerary...')}
              >
                {(handlers) => (
                  <ApprovalWorkflow
                    onApproveItinerary={handlers.handleApproval}
                    onRequestCall={handlers.handleCall}
                    onSaveChanges={handlers.handleSave}
                    onShareItinerary={handlers.handleShare}
                    onPrintItinerary={handlers.handlePrint}
                  />
                )}
              </WorkflowActions>
            </div>
          </div>
        </div>
      </div>

      {/* Template Integration Sidebar */}
      <TemplateIntegrationProvider
        showTemplateSidebar={showTemplateSidebar}
        templateSearchQuery={templateSearchQuery}
        onSearchChange={setTemplateSearchQuery}
        onTemplateSelect={handleTemplateSelect}
        showTemplateModal={showTemplateModal}
        selectedTemplate={selectedTemplate}
        onTemplateConfirm={handleConfirmTemplate}
        onTemplateCancel={handleTemplateCancel}
        onToggleSidebar={toggleTemplateSidebar}
      />
    </div>
  );
};

export default CreateItineraryContent;
