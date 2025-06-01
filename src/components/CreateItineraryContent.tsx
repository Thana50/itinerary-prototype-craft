
import React, { useRef } from "react";
import TripOverviewForm from "@/components/TripOverviewForm";
import AIAssistant, { AIAssistantRef } from "@/components/AIAssistant";

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Trip Overview Form */}
      <div className="lg:col-span-2">
        <TripOverviewForm 
          formData={formData} 
          onFormChange={onFormChange} 
          sampleItinerary={sampleItinerary}
        />
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
  );
};

export default CreateItineraryContent;
