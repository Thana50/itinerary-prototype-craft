import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import TripOverviewForm from "./TripOverviewForm";
import ItineraryPreview from "./ItineraryPreview";
import ModificationTracking from "./ModificationTracking";
import PricingUpdates from "./PricingUpdates";
import ApprovalWorkflow from "./ApprovalWorkflow";
import WeatherForecast from "./WeatherForecast";
import TemplateSidebar from "./templates/TemplateSidebar";
import TemplateConfirmationModal from "./templates/TemplateConfirmationModal";
import EnhancedChatInterface from "./EnhancedChatInterface";
import { useTemplateIntegration } from "@/hooks/useTemplateIntegration";
import { ItineraryTemplate } from "@/types/templates";
import { toast } from "@/hooks/use-toast";

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
      onFormChange('numberOfTravelers', 4); // Default from template
      
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

  const handleApproval = () => {
    alert('Itinerary Approved!');
  };

  const handleCall = () => {
    alert('Requesting agent call...');
  };

  const handleSave = () => {
    alert('Saving changes...');
  };

  const handleShare = () => {
    alert('Sharing itinerary...');
  };

  const handlePrint = () => {
    alert('Printing itinerary...');
  };

  return (
    <div className="flex">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${showTemplateSidebar ? 'mr-80' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <TripOverviewForm formData={formData} onFormChange={onFormChange} />
            
            {/* Enhanced AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>AI Travel Assistant</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowEnhancedChat(!showEnhancedChat)}
                  >
                    {showEnhancedChat ? 'Basic Chat' : 'Enhanced Chat'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showEnhancedChat ? (
                  <EnhancedChatInterface
                    onTemplateSelect={handleTemplateFromChat}
                    onMessageSend={onMessageSend}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                      <p className="text-sm text-gray-600">
                        Start describing your trip requirements to get personalized recommendations...
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Tell me about your trip..."
                        className="flex-1"
                      />
                      <Button>Send</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <ModificationTracking modifications={modifications} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ItineraryPreview sampleItinerary={sampleItinerary} />
            <PricingUpdates totalPrice={totalPrice} modifications={modifications} />
            <WeatherForecast />
            <ApprovalWorkflow
              onApproveItinerary={handleApproval}
              onRequestCall={handleCall}
              onSaveChanges={handleSave}
              onShareItinerary={handleShare}
              onPrintItinerary={handlePrint}
            />
          </div>
        </div>
      </div>

      {/* Template Sidebar */}
      <TemplateSidebar
        searchQuery={templateSearchQuery}
        onTemplateSelect={handleTemplateSelect}
        onSearchChange={setTemplateSearchQuery}
        isVisible={showTemplateSidebar}
      />

      {/* Template Confirmation Modal */}
      {showTemplateModal && selectedTemplate && (
        <TemplateConfirmationModal
          template={selectedTemplate}
          onConfirm={handleConfirmTemplate}
          onCancel={handleTemplateCancel}
        />
      )}
    </div>
  );
};

export default CreateItineraryContent;
